import React, { useEffect, useState } from 'react';
import '../css/ProductPage.css'; // Include the corresponding CSS
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import Rating from '../Components/Common/Rating';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query
import { getProduct, addCartItem, getProducts } from '../util/queries'; // Import the API functions
import { useDispatch } from 'react-redux';
import { addToCart } from '../Store/cartSlice'; // Redux action for adding to cart
import { toast } from 'react-toastify';
import Loader from '../Components/Common/Loader';
import ProductListItem from '../Components/Products/ProductListItem';

const ProductPage = () => {
  const { id } = useParams(); 
  const [quantity, setQuantity] = useState(1); 
  const dispatch = useDispatch(); 
  const queryClient = useQueryClient(); 
  useEffect(() => {

    document.title = "Product | "; // Change this title as needed
  }, [])
  
  
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id], 
    onSuccess:()=>{
      document.title += String(product?.name)
    },
    queryFn: () => getProduct(id), 
  });
  const { data:RelatedProduct, isLoading, error, isFetching, isSuccess } = useQuery({
    queryKey: [
      "products_RelatedProduct",
      {
       
        page_size: 3,
      
        enabled: !!product,
        category: product?.category?.category_id,

      },
    ],
    queryFn: getProducts,
    keepPreviousData: true, 
  });
  // console.log("RelatedProduct",RelatedProduct)
  if(!productLoading){
    document.title += String(product?.name)
  }

  const mutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: (data) => {
      
      dispatch(
        addToCart({
          id: product.product_id,
          name: product.name,
          price: product.price,
          quantity: quantity, 
        })
      );
      toast.success(`${quantity} ${product.name}(s) added to cart!`);
      // Invalidate the cart data to refetch
      queryClient.invalidateQueries('cartData');
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
    },
  });


  const handleAddToCart = () => {
    mutation.mutate({
      product: product.product_id,
      quantity: quantity,
      price: product.price,
    });
  };

 
  if (productError) return <div>Error loading product: {productError.message}</div>;

  
  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <>
      <NavBar />
      <div className="main-product-page">
        <div className="main-product-breadcrumb">
          <Link to="/" style={{ color: 'black' }}>Home</Link> / {product?.name}
        </div>
        {productLoading && <Loader/>}
        {!productLoading && !product && (
                <div className="Product-not-Found">
                  Product Not Found
                </div>
              ) }
        {!productLoading && 
        <div className="main-product-container">
          <div className="main-product-images">
          
            <img
              src={product?.productPic ? `${import.meta.env.VITE_BACKEND_END_POINT_image}${product?.productPic}` : 'default-image.jpg'}
              alt={product?.name}
            />
          </div> 
          

          <div className="main-product-info">
            <h1 className="main-product-title">{product.name}</h1>
            <div className="main-product-rating">
              <Rating value={4.0} count={64} /> -{' '}
              <span className="main-product-in-stock">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="main-product-price">${product.price}</div>
            <p className="main-product-description">
              {product.description || 'No description available for this product.'}
            </p>

            <div className="main-product-options">
              <div className="main-product-quantity-selection">
                <button onClick={handleDecrease} disabled={quantity === 1}>-</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={handleIncrease}>+</button>
              </div>
            </div>

            <button
              className="main-product-buy-now"
              onClick={handleAddToCart}
              disabled={mutation.isLoading || product.stock === 0}
            >
              {product.stock != 0 ?(mutation.isLoading ? 'Adding...' : `Add ${quantity} to cart`): 'Out of Stock'}
            </button>

            <div className="main-product-delivery-options">
              <div>Free Delivery</div>
              <div>Return Delivery</div>
            </div>
          </div>
        </div>
}
        <div className="main-product-related-items">
          <h1>Related Items</h1>
          <div className="main-product-related-products">
         {
          isLoading ? <Loader/> :
          RelatedProduct?.results?.data.filter((elem)=>elem?.product_id != product?.product_id).length==0?<h1 className='Product-not-Found' style={{height:'initial',width:'initial',fontSize:'initial'}}>NO product Found</h1>:
          RelatedProduct?.results?.data.filter((elem)=>elem?.product_id != product?.product_id).map((elem,index)=>{
              // console.log()
            return(<ProductListItem product={elem} key={index}/>)
          })
         } 
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
