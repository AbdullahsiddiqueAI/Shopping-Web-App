import React, { useState } from 'react';
import Rating from '../Common/Rating'; // Assuming you have a Rating component
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query's useMutation
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Store/cartSlice'; // Redux action for adding to cart
import { addCartItem } from '../../util/queries'; // API function for adding product to cart
import { toast } from 'react-toastify';
import SmallLoader from '../Common/SmallLoader';

const ProductListItem = ({ product }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); 
  const [loading, setLoading] = useState(false); 

  
  const mutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: (data) => {
      
      dispatch(addToCart({
        id: product.product_id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }));
      toast.success(`${product.name}(s) added to cart!`);
      queryClient.invalidateQueries('cartData'); 
      setLoading(false); 
    },
    onError: (error) => {
      toast.error("Error adding to cart. Please try again.");
      setLoading(false); 
  }});

 
  const handleAddToCart = () => {
    setLoading(true); 
    mutation.mutate({ product: product.product_id, quantity: 1, price: product.price });
  };

  return (
    <div className="Product_list-items">
      <Link to={`/ProductPage/${product.product_id}`}>
        <div className="Product_list-items-img">
        
          <img 
            src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${product.productPic}` || 'default-image.jpg'} 
            alt={product.name} 
          />
        </div>
        <div className="Product_list-items-text" title={String(product.name)}>{String(product.name).slice(0, 25)}{String(product.name).length > 25 ? "..." : ''}</div>
        <div>
          <div className="Product_list-items-text-price">${product.price}</div>
          <div title={String(product.description)}>{String(product.description).slice(0, 25)}{String(product.description).length > 25 ? "..." : ''}</div>
          
          <Rating value={product?.rating || 4.0} count={product?.reviewCount || 64} />
        </div>
      </Link>
      <div className="Product_list-Add_cart">
      <button onClick={handleAddToCart} style={{backgroundColor:loading ?"initial":"#3c3c3c",cursor:loading || product.stock == 0 ? 'initial':'pointer'}} className="Product_list-Add_cart-text" disabled={loading || product.stock == 0}>
         {
           product.stock != 0 ?(loading ? <div style={{display:'grid',placeItems:"center",width:"100%",height:"100%"}}><SmallLoader/></div> : 'Add to Cart')
          : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductListItem;
