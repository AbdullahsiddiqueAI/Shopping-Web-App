import React, { useState, useEffect } from 'react';
import '../css/Cart.css'; 
import { AiFillDelete } from 'react-icons/ai'; 
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import { deleteCartItem, getCartData } from '../util/queries'; 
import { setCartData, updateCart, removeFromCart } from '../Store/cartSlice'; 
import { toast } from 'react-toastify';
import { openDrawer } from '../Store/drawerSlice';

const Cart = ({nav=true,footer=true}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); 
  const cartItems = useSelector((state) => state.cart.items);
  const {isAuthenticated} = useSelector((state) => state.auth);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const [couponCode, setCouponCode] = useState("");
  useEffect(() => {
    document.title = "Cart"; 
  }, [])
 
  const { mutate: deleteItem } = useMutation({
    mutationFn: (id)=>deleteCartItem(id),
    onSuccess: () => {
      toast.success('Item removed from cart successfully.');
     
      queryClient.invalidateQueries('cartData');
    },
    onError: (error) => {
      toast.error('Failed to remove item from cart.');
    },
  });

  
  const { data: cartData, isLoading, error, isSuccess } = useQuery({
    queryKey: ['cartData'],
    queryFn: getCartData,
    enabled: isAuthenticated,
    onSuccess: (data) => {
      console.log('Cart Data Loaded', data);
    },
  });

 
  useEffect(() => {
    if (isSuccess && cartData) {
      const formattedCartData = cartData.map((item) => ({
        id: item.product.product_id,
        name: item.product.name,
        price: item.product.price,
        productPic: item.product.productPic,
        quantity: item.quantity, 
        totalPrice: item.product.price * item.quantity,
      }));

      
      dispatch(setCartData(formattedCartData));
    }
  }, [isSuccess, cartData, dispatch]);

  const handleQuantityChange = (id, newQuantity, price) => {
    dispatch(updateCart({ id, newQuantity, price }));
    
  };

  const handleRemoveItem = (id) => {
    
    dispatch(removeFromCart({ id }));
 
    deleteItem(id);
  };



  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (isLoading) return <div>Loading cart data...</div>;
  if (error) return <div>Error loading cart: {error.message}</div>;
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 786);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 786);
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {nav && <NavBar />}
      <div className="cart-container">
        <div className="cart-breadcrumb">
          <Link to="/" style={{ color: 'black' }}>Home</Link> / Cart
        </div>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center' }}>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="cart-product-info">
                    <img src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${item.productPic}`} alt={item.name} className="cart-product-image" />
                    <span title={item.name}>{!isSmallScreen && item.name} {isSmallScreen && String(item.name).slice(0,20)} { isSmallScreen && String(item.name).length>20 ? '...':''}</span>
                  </td>
                  <td>${item.price}</td>
                  <td>
                   {item.quantity}
                  </td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <AiFillDelete
                      size={24}
                      className="cart-delete-icon"
                      onClick={() => handleRemoveItem(String(item.id))}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ color: 'grey' }}>
                  <h1>Your cart is empty</h1>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="cart-actions">
          <Link to="/products">
          <button className="cart-return-button">Return To Shop</button>
          </Link>
          
          
          <button className="cart-update-button" onClick={()=>dispatch(openDrawer())}>Update Cart</button>
          
        </div>

        <div className="cart-summary">
          <h3>Cart Total</h3>
          <div className="cart-summary-item">
            <span>Subtotal:</span>
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
         <Link to='/payment'> 
         
          <button className="cart-checkout-button">Proceed to checkout</button>
         </Link>
        </div>
      </div>
      {footer && <Footer />}
    </>
  );
};

export default Cart;
