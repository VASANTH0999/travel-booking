// src/pages/Booking.jsx
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import Confetti from 'react-confetti'; // Install with: npm install react-confetti
import '../styles/Booking.css';

const stripePromise = loadStripe('pk_test_51R3WdyQiUIGWJ1XnRfTcg2EDI27KnIX8pyYuVaKj3PJSY7HjNiiNfyrHcs1uoUXNlixMra02rlvM2b3l5XSvkDV9003PWG3zRE');

function Booking() {
  const { state } = useLocation();
  const { item, type } = state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500); // Simulate loading
    let interval;
    if (isConfirmed) {
      interval = setInterval(() => setProgress((prev) => (prev >= 100 ? 100 : prev + 10)), 200);
    }
    return () => clearInterval(interval);
  }, [isConfirmed]);

  const handlePaymentSuccess = () => {
    setIsConfirmed(true);
    setTimeout(() => setIsConfirmed(false), 3000); // Hide confirmation after 3s
  };

  if (isLoading) {
    return <div className="loading">Preparing your booking...</div>;
  }

  return (
    <div className="booking-page">
      <h1>Book Your {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      {isConfirmed && <Confetti />}
      {isConfirmed && (
        <div className="progress-ring">
          <svg width="100" height="100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#28a745"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${(progress / 100) * 251.2} 251.2`}
            />
            <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="16" fill="#28a745">
              {progress}%
            </text>
          </svg>
        </div>
      )}
      {isConfirmed && <div className="confirmation">Booking confirmed! Thank you!</div>}
      {item ? (
        <div className="selected-item">
          <div className="card-flip">
            <div className="card-front">
              <h3>Selected {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              {type === 'flight' && (
                <div>
                  <p>
                    <strong>{item.airline}</strong>: {item.from} to {item.to} on {item.date}
                  </p>
                  <p>Duration: {item.duration}</p>
                  <p>Departure: {item.departureTime} | Arrival: {item.arrivalTime}</p>
                  <p>Price: ${item.price}</p>
                </div>
              )}
              {type === 'hotel' && (
                <div>
                  <p>
                    <strong>{item.name}</strong> in {item.location}
                  </p>
                  <p>Price: ${item.price}/night</p>
                  <p>Rating: {item.rating}/5</p>
                  <p>Amenities: {item.amenities.join(', ')}</p>
                </div>
              )}
              {type === 'car' && (
                <div>
                  <p>
                    <strong>{item.type}</strong> by {item.company} in {item.location}
                  </p>
                  <p>Price: ${item.price}/day</p>
                  <p>Features: {item.features.join(', ')}</p>
                </div>
              )}
            </div>
            <div className="card-back">
              <p>Thank you for choosing us! Your booking details will be emailed shortly.</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No item selected. Please go back and select an item to book.</p>
      )}
      <Elements stripe={stripePromise}>
        <PaymentForm amount={item?.price || 500} item={item} type={type} onSuccess={handlePaymentSuccess} />
      </Elements>
    </div>
  );
}

export default Booking;