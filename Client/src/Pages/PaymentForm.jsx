import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import instance from '../util/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import '../css/PaymentForm.css'; 
import cardImage from '../css/img/card.png'; 


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const { totalPrice } = useSelector((state) => state.cart);

 
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '**** **** **** ****', 
        expiry: 'MM/YY',
        cvc: '***'
    });

   
    const maskCardNumber = (number) => {
        return number.replace(/\d(?=\d{4})/g, "*");
    };

   
    const handleCardNumberChange = (event) => {
        console.log(event)
        if (event.error) {
            setErrorMessage(event.error.message);
        } else {
            setErrorMessage('');
        }

        if (event.complete) {
           
            setCardDetails((prevState) => ({
                ...prevState,
                cardNumber: maskCardNumber('4242 4242 4242 4242') // Simulated, since real card numbers can't be accessed
            }));
        } else {
            // Show placeholders or incomplete card number while typing
            setCardDetails((prevState) => ({
                ...prevState,
                cardNumber: event.value ? maskCardNumber(event.value) : '**** **** **** ****'
            }));
        }
    };

   
    const handleExpiryChange = (event) => {
        if (event.error) {
            setErrorMessage(event.error.message);
        } else {
            setErrorMessage('');
        }

        if (event.complete) {
            setCardDetails((prevState) => ({
                ...prevState,
                expiry: '12/25'
            }));
        } else {
            setCardDetails((prevState) => ({
                ...prevState,
                expiry: 'MM/YY'
            }));
        }
    };

   
    const handleCvcChange = (event) => {
        if (event.error) {
            setErrorMessage(event.error.message);
        } else {
            setErrorMessage('');
        }
       

        if (event.complete) {
            setCardDetails((prevState) => ({
                ...prevState,
                cvc: '123'
            }));
        } else {
            setCardDetails((prevState) => ({
                ...prevState,
                cvc: '***'
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccess(false);

        if (!stripe || !elements) {
            setErrorMessage('Stripe has not loaded yet. Please try again later.');
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);
        const { error, token } = await stripe.createToken(cardElement);

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        try {
            const response = await instance.post(`/payment/`, {
                token: token.id,
                total_amount: totalPrice,
                currency: 'usd',
                description: 'Order payment',
            });

            if (response.data && response.data.success) {
                setSuccess(true);
                queryClient.invalidateQueries('cartData');
                toast.success(`Payment Successful!`);
                navigate('/Myaccount/Myorders');
                setErrorMessage('');
            } else {
                toast.error(`Payment failed!`);
                setErrorMessage(response.data.error || 'Payment failed');
            }

        } catch (err) {
            if (err.response && err.response.data) {
                setErrorMessage(err.response.data.error || 'Payment failed');
            } else {
                setErrorMessage('Network error. Please try again.');
            }
        }

        setLoading(false);
    };

    return (
        <div className="outercontainer">
            <div className="card-display">
                <img src={cardImage} alt="Card" className="card-img" />
                <div className="card-details">
                    <p className="card-number"><span className='expiry-date-text'>Card Number:</span> {cardDetails.cardNumber}</p>
                    <p className="expiry-date"><span className='expiry-date-text'>Expiry Date:</span> <span>{cardDetails.expiry}</span></p>
                    <p className="cvc-code"><span className='expiry-date-text'>CVC: </span>{cardDetails.cvc}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <div className="inputContainer">
                    <label>Card Number</label>
                    <CardNumberElement className="cardElement" onChange={handleCardNumberChange} />
                </div>
                <div className="inputContainer">
                    <label>Expiry Date</label>
                    <CardExpiryElement className="cardElement" onChange={handleExpiryChange} />
                </div>
                <div className="inputContainer">
                    <label>CVC</label>
                    <CardCvcElement className="cardElement" onChange={handleCvcChange} />
                </div>
                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                {success && <p className="successMessage">Payment Successful!</p>}
                <button type="submit" disabled={!stripe || loading} className="button">
                    {loading ? 'Processing...' : 'Pay'}
                </button>
            </form>
        </div>
    );
};

const PaymentForm = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default PaymentForm;
