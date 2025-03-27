// src/components/PaymentForm.jsx
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PaymentForm.css';

function PaymentForm({ amount, item, type }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError('Stripe has not loaded properly. Please try again.');
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      console.log('Creating Stripe payment method...');
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Stripe payment method error:', error);
        setError(error.message);
        setProcessing(false);
        return;
      }

      console.log('Payment Method created:', paymentMethod);
      const bookingData = {
        userId: 'user123',
        type: type,
        details: item,
        amount: amount,
        paymentMethodId: paymentMethod.id,
      };

      console.log('Sending booking request to backend:', bookingData);
      const response = await axios.post('http://localhost:5000/api/book', bookingData);

      console.log('Backend response:', response.data);

      if (response.data.success) {
        console.log('Booking successful, navigating to confirmation...');
        navigate('/confirmation', {
          state: {
            bookingData: {
              reference: response.data.bookingId,
              amount: amount,
            },
          },
        });
      } else {
        console.error('Booking failed:', response.data);
        setError('Booking failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during booking process:', err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    if (event.error) {
      if (event.error.code === 'incomplete_cvc') {
        setError(
          `Please enter a valid CVC (${event.brand === 'amex' ? '4 digits for Amex' : '3 digits'})`
        );
      } else {
        setError(event.error.message);
      }
    } else {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement onChange={handleCardChange} />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
}

export default PaymentForm;