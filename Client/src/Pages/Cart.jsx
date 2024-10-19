import React, { useState, useEffect } from 'react';
import '../css/Cart.css'; // Assuming this is your CSS file
import { AiFillDelete } from 'react-icons/ai'; // Importing the delete icon
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Redux hooks
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // Import React Query hook
import { deleteCartItem, getCartData } from '../util/queries'; // Import the API function to fetch cart data
import { setCartData, updateCart, removeFromCart } from '../Store/cartSlice'; // Redux actions
import { toast } from 'react-toastify';
import { openDrawer } from '../Store/drawerSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient(); // To manually invalidate queries
  const cartItems = useSelector((state) => state.cart.items);
  const {isAuthenticated} = useSelector((state) => state.auth);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const [couponCode, setCouponCode] = useState("");

  // React Query mutation for deleting cart items
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

  // Use React Query to fetch cart data from the API
  const { data: cartData, isLoading, error, isSuccess } = useQuery({
    queryKey: ['cartData'],
    queryFn: getCartData,
    enabled: isAuthenticated,
    onSuccess: (data) => {
      console.log('Cart Data Loaded', data);
    },
  });

  // Update Redux store when cart data is successfully fetched
  useEffect(() => {
    if (isSuccess && cartData) {
      const formattedCartData = cartData.map((item) => ({
        id: item.product.product_id,
        name: item.product.name,
        price: item.product.price,
        productPic: item.product.productPic,
        quantity: item.quantity, // Assuming 'quantity' comes from the API
        totalPrice: item.product.price * item.quantity,
      }));

      // Dispatch the formatted cart data to the Redux store
      dispatch(setCartData(formattedCartData));
    }
  }, [isSuccess, cartData, dispatch]);

  const handleQuantityChange = (id, newQuantity, price) => {
    dispatch(updateCart({ id, newQuantity, price }));
    // Optionally, sync the updated cart to the backend here with an API call
  };

  const handleRemoveItem = (id) => {
    // Optimistically remove the item from Redux store
    dispatch(removeFromCart({ id }));
    // Call the mutation to delete the item from the backend
    deleteItem(id);
  };

  const handleCouponApply = () => {
    console.log('Coupon applied:', couponCode);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (isLoading) return <div>Loading cart data...</div>;
  if (error) return <div>Error loading cart: {error.message}</div>;

  return (
    <>
      <NavBar />
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
                    <img src={`http://127.0.0.1:8000/${item.productPic}`} alt={item.name} className="cart-product-image" />
                    <span>{item.name}</span>
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
      <Footer />
    </>
  );
};

export default Cart;
