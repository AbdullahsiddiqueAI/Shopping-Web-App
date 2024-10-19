import React, { useState } from 'react';
import '../css/ProductPage.css'; // Include the corresponding CSS
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import Rating from '../Components/Common/Rating';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query
import { getProduct, addCartItem } from '../util/queries'; // Import the API functions
import { useDispatch } from 'react-redux';
import { addToCart } from '../Store/cartSlice'; // Redux action for adding to cart
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [quantity, setQuantity] = useState(1); // State to manage quantity count
  const dispatch = useDispatch(); // Redux dispatch
  const queryClient = useQueryClient(); // React Query's cache management

  // Fetch the main product details using React Query
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id], // Use product ID as part of the query key
    queryFn: () => getProduct(id), // Fetch the product by ID
  });

  // React Query mutation for adding product to cart
  const mutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: (data) => {
      // Once the product is successfully added to the backend cart,
      // update the Redux store with the product information
      dispatch(
        addToCart({
          id: product.product_id,
          name: product.name,
          price: product.price,
          quantity: quantity, // Use the selected quantity
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

  // Function to handle adding product to the cart
  const handleAddToCart = () => {
    mutation.mutate({
      product: product.product_id,
      quantity: quantity,
      price: product.price,
    });
  };

  // Handle loading and error states
  if (productLoading) return <div>Loading...</div>;
  if (productError) return <div>Error loading product: {productError.message}</div>;

  // Fallback if product not found
  if (!product) return <div>Product not found</div>;

  // Function to handle quantity increase
  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Function to handle quantity decrease
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
          <Link to="/" style={{ color: 'black' }}>Home</Link> / {product.name}
        </div>

        <div className="main-product-container">
          <div className="main-product-images">
            {/* Display product image or fallback to a default image */}
            <img
              src={product.productPic ? `http://127.0.0.1:8000/${product.productPic}` : 'default-image.jpg'}
              alt={product.name}
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
              {mutation.isLoading ? 'Adding...' : `Add ${quantity} to cart`}
            </button>

            <div className="main-product-delivery-options">
              <div>Free Delivery</div>
              <div>Return Delivery</div>
            </div>
          </div>
        </div>

        <div className="main-product-related-items">
          <h1>Related Items</h1>
          <div className="main-product-related-products">
            {/* Dynamically display related products */}
            {/* Related products logic would go here */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
