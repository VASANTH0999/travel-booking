// src/pages/Confirmation.jsx
import { useLocation } from 'react-router-dom';
import '../styles/Confirmation.css';

function Confirmation() {
  const location = useLocation();
  const bookingData = location.state?.bookingData || {};

  return (
    <div className="confirmation-page">
      <h1>Booking Confirmation</h1>
      <div className="confirmation-details">
        <h2>Thank You for Your Booking!</h2>
        <p>Booking Reference: {bookingData.reference || 'N/A'}</p>
        <p>Total Amount: ${bookingData.amount || 'N/A'}</p>
        <button onClick={() => window.print()}>Print Confirmation</button>
      </div>
    </div>
  );
}

export default Confirmation;