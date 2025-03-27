
// src/pages/Booking.jsx
import { useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import '../styles/Booking.css';
const stripePromise = loadStripe('pk_test_51R3WdyQiUIGWJ1XnRfTcg2EDI27KnIX8pyYuVaKj3PJSY7HjNiiNfyrHcs1uoUXNlixMra02rlvM2b3l5XSvkDV9003PWG3zRE');

function Booking() {
  const { state } = useLocation();
  const { item, type } = state || {};

  return (
    <div className="booking-page">
      <h1>Book Your {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      {item ? (
        <div className="selected-item">
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
      ) : (
        <p>No item selected. Please go back and select an item to book.</p>
      )}
      <Elements stripe={stripePromise}>
        <PaymentForm amount={item?.price || 500} item={item} type={type} />
      </Elements>
    </div>
  );
}

export default Booking;