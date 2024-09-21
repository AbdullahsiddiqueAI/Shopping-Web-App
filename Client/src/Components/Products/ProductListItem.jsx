import React from 'react';
import Rating from '../Common/Rating'; // Assuming you have a Rating component
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query's useMutation
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Store/cartSlice'; // Redux action for adding to cart
import { addCartItem } from '../../util/queries'; // API function for adding product to cart

const ProductListItem = ({ product }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); // To manually invalidate queries

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
        quantity: 1 // Adding 1 unit to the cart (or more if needed)
      }));
      queryClient.invalidateQueries('cartData');
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
    }
  });

  // Handle Add to Cart button click
  const handleAddToCart = () => {
    mutation.mutate({ product: product.product_id, quantity: 1,price:product.price }); // API expects the product ID and quantity
  };

  return (
    <div className="Product_list-items">
      <div className="Product_list-items-img">
        {/* Display product image or fallback to a default image */}
        <img src={`http://127.0.0.1:8000/${product.productPic}` || 'default-image.jpg'} alt={product.name} />
      </div>
      <div className="Product_list-items-text">{product.name}</div>
      <div>
        <div className="Product_list-items-text-price">${product.price}</div>
        <div>{String(product.description).slice(0, 25)}{String(product.description).length > 25 ? "..." : ''}</div>
        {/* Assuming you have a Rating component that accepts rating and review count */}
        <Rating value={product?.rating || 4.0} count={product?.reviewCount || 64} />
      </div>
      <div className="Product_list-Add_cart">
        <button onClick={handleAddToCart} className="Product_list-Add_cart-text" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductListItem;
