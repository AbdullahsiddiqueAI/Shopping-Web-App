import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, token } = await stripe.createToken(cardElement);

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        // Send token and other details to backend
        const response = await fetch(`${import.meta.env.VITE_BACKEND_END_POINT}/payment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token.id,
                amount: 5000, // Amount in cents
                currency: 'usd',
                description: 'Order payment',
                order_id: "257538ef-6eaa-4bc8-8b6b-13a0f5c76fc0"
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess(true);
        } else {
            setErrorMessage(data.error || 'Payment failed');
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
