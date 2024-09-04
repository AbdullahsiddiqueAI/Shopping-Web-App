import React, { useState } from 'react';
import '../css/Cart.css'; // Assuming this is your CSS file
import { AiFillDelete } from 'react-icons/ai'; // Importing the delete icon
import imageUrl from '../css/img/Product_images/Canon-750-D-overview.jpg';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "LCD Monitor", price: 650, quantity: 1, image: imageUrl },
    { id: 2, name: "HI Gamepad", price: 550, quantity: 2, image: imageUrl }
  ]);
  
  const [couponCode, setCouponCode] = useState("");
  
  const handleQuantityChange = (id, newQuantity) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
  };

  const handleCouponApply = () => {
    // Add functionality to apply coupon
    console.log("Coupon applied:", couponCode);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <>
    <NavBar/>
    <div className="cart-container">
      <div className="cart-breadcrumb">
       <Link to='/' style={{color:"black"}}>Home</Link>  / Cart
      </div>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th> {/* Added Action column for delete button */}
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td className="cart-product-info">
                <img src={item.image} alt={item.name} className="cart-product-image" />
                <span>{item.name}</span>
              </td>
              <td>${item.price}</td>
              <td>
                <select
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                >
                  {[...Array(10).keys()].map((q) => (
                    <option key={q + 1} value={q + 1}>
                      {q + 1}
                    </option>
                  ))}
                </select>
              </td>
              <td>${item.price * item.quantity}</td>
              <td>
                <AiFillDelete 
                  size={24} 
                  className="cart-delete-icon"
                  onClick={() => handleRemoveItem(item.id)} 
                /> {/* Delete icon with onClick handler */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-actions">
        <button className="cart-return-button">Return To Shop</button>
        <button className="cart-update-button">Update Cart</button>
      </div>

      <div className="cart-summary">
        <h3>Cart Total</h3>
        <div className="cart-summary-item">
          <span>Subtotal:</span>
          <span>${getTotal()}</span>
        </div>
        <div className="cart-summary-item">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="cart-summary-item cart-total">
          <span>Total:</span>
          <span>${getTotal()}</span>
        </div>
        <button className="cart-checkout-button">Proceed to checkout</button>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Cart;
