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
  const queryClient = useQueryClient(); // To manually invalidate queries
  const [loading, setLoading] = useState(false); // State to manage loading manually

  // React Query mutation for adding product to cart
  const mutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: (data) => {
      // Once the product is successfully added to the backend cart,
      // update the Redux store
      dispatch(addToCart({
        id: product.product_id,
        name: product.name,
        price: product.price,
        quantity: 1, // Adding 1 unit to the cart
      }));
      toast.success(`${product.name}(s) added to cart!`);
      queryClient.invalidateQueries('cartData'); // Invalidate the cart data to refetch
      setLoading(false); // Reset the loading state
    },
    onError: (error) => {
      toast.error("Error adding to cart. Please try again.");
      setLoading(false); // Reset the loading state in case of error
    }
  });

  // Handle Add to Cart button click
  const handleAddToCart = () => {
    setLoading(true); // Set loading state to true when the process starts
    mutation.mutate({ product: product.product_id, quantity: 1, price: product.price });
  };

  return (
    <div className="Product_list-items">
      <Link to={`/ProductPage/${product.product_id}`}>
        <div className="Product_list-items-img">
          {/* Display product image or fallback to a default image */}
          <img 
            src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${product.productPic}` || 'default-image.jpg'} 
            alt={product.name} 
          />
        </div>
        <div className="Product_list-items-text">{product.name}</div>
        <div>
          <div className="Product_list-items-text-price">${product.price}</div>
          <div>{String(product.description).slice(0, 25)}{String(product.description).length > 25 ? "..." : ''}</div>
          {/* Assuming you have a Rating component that accepts rating and review count */}
          <Rating value={product?.rating || 4.0} count={product?.reviewCount || 64} />
        </div>
      </Link>
      <div className="Product_list-Add_cart">
      <button onClick={handleAddToCart} style={{backgroundColor:loading ?"initial":"#3c3c3c"}} className="Product_list-Add_cart-text" disabled={loading}>
          {loading ? <div style={{display:'grid',placeItems:"center",width:"100%",height:"100%"}}><SmallLoader/></div> : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductListItem;
