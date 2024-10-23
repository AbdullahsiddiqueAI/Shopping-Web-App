// src/components/Drawer.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeDrawer } from '../../Store/drawerSlice';
import { removeFromCart } from '../../Store/cartSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteCartItem } from '../../util/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import './Drawer.css'; // Make sure to implement your CSS here

const Drawer = () => {
  const isOpen = useSelector(state => state.drawer.isOpen);
  const cartItems = useSelector(state => state.cart.items);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const totalPrice = useSelector(state => state.cart.totalPrice);
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); // Get the query client
  const { mutate: deleteItem } = useMutation({
    mutationFn: (id)=>deleteCartItem(id),
    onSuccess: () => {
      toast.success('Item removed from cart successfully.');
      // Invalidate the cart data to refetch the updated cart data
      queryClient.invalidateQueries('cartData');
    },
    onError: (error) => {
      toast.error('Failed to remove item from cart.');
    },
    
  });

  const handleRemoveItem = (id) => {
    // Optimistically remove the item from Redux store
    dispatch(removeFromCart({ id }));
    // Call the mutation to delete the item from the backend
    deleteItem(id);
  };

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={() => dispatch(closeDrawer())}></div>
      <div className="drawer-content">
        <button className="close-button" onClick={() => dispatch(closeDrawer())}>×</button>
        <h2>Shopping Cart</h2>
        {totalQuantity === 0 ? (
          <>
            <p>Your cart is empty</p>
            <button className="continue-shopping" onClick={() => dispatch(closeDrawer())}>
             <Link to='/Products'> Continue Shopping </Link>
            </button>
          </>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${item.productPic}`} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Subtotal: ${item.totalPrice}</p>
                    <button
                      className="remove-item"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary-Drawer">
              <h3>Total Quantity: {totalQuantity}</h3>
              <h3>Total Price: ${totalPrice}</h3>
            </div>
            <button className="checkout-button"><Link to='/Cart' onClick={()=>dispatch(closeDrawer())}>Proceed to Checkout</Link> </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Drawer;
