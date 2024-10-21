import React from 'react';
import PaymentForm from './PaymentForm';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux store

const PayementPage = () => {
  const cartItems = useSelector((state) => state.cart.items); // Get cart items from Redux store
  const totalPrice = useSelector((state) => state.cart.totalPrice); // Get total price from Redux store

  // Calculate the total number of items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="payementPage-container">
      <div className="payementPage-left">
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary-item">
            <span>Number of Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="cart-summary-item">
            <span>Total Price:</span>
            <span>${totalPrice}</span>
          </div>
          <div className="cart-summary-item">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="cart-summary-item cart-total">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>
      <div className="payementPage-right">
        {/* Payment form goes on the right */}
        <PaymentForm />
      </div>
    </div>
  );
};

export default PayementPage;
