import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import instance from '../util/axios'; // Import the Axios instance
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

// Load Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const navigate=useNavigate()
    const queryClient=useQueryClient();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const {items,totalPrice}=useSelector((state)=>state.cart)
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

        const cardElement = elements.getElement(CardElement);
        const { error, token } = await stripe.createToken(cardElement);

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        try {
            // Axios request using the Axios instance
            const response = await instance.post(`/payment/`, {
                token: token.id,
                total_amount: totalPrice, // Amount in cents (e.g., $50.00)
                currency: 'usd',
                description: 'Order payment',
            });

            if (response.data && response.data.success) {
                setSuccess(true);
                queryClient.invalidateQueries('cartData')
                toast.success(`Payment Successful!`);
                navigate('/Myaccount/Myorders');
                setErrorMessage('');  // Clear error message in case it was set earlier
            } else {
                // Handle case when there's no success flag but request was processed
                toast.error(`Payment failed!`);
                setErrorMessage(response.data.error || 'Payment failed');
            }

        } catch (err) {
            // Catch Axios errors, possibly including network issues
            if (err.response && err.response.data) {
                // Server provided an error response
                setErrorMessage(err.response.data.error || 'Payment failed');
            } else {
                // No response from the server, likely a network error
                setErrorMessage('Network error. Please try again.');
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputContainer}>
                <CardElement style={styles.cardElement} />
            </div>
            {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
            {success && <p style={styles.successMessage}>Payment Successful!</p>}
            <button type="submit" disabled={!stripe || loading} style={styles.button}>
                {loading ? 'Processing...' : 'Pay'}
            </button>
        </form>
    );
};

const PaymentForm = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

// Styles in JS
const styles = {
    form: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    cardElement: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
    },
    button: {
        width: '100%',
        padding: '10px 15px',
        backgroundColor: '#6772e5',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    errorMessage: {
        color: 'red',
        marginBottom: '10px',
    },
    successMessage: {
        color: 'green',
        marginBottom: '10px',
    },
};

export default PaymentForm;
