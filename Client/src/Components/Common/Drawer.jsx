// Drawer.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeDrawer } from '../../Store/drawerSlice';
// import { closeDrawer } from './drawerSlice';
// import './Drawer.css';

const Drawer = () => {
  const isOpen = useSelector(state => state.drawer.isOpen);
  const dispatch = useDispatch();

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={() => dispatch(closeDrawer())}></div>
      <div className="drawer-content">
        <button className="close-button" onClick={() => dispatch(closeDrawer())}>×</button>
        <h2>Shopping Cart</h2>
        <p>0 items</p>
        <p>Your cart is empty</p>
        <button className="continue-shopping">Continue Shopping</button>
      </div>
    </div>
  );
};

export default Drawer;
