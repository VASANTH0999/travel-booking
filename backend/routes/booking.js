// backend/routes/booking.js
const express = require('express');
const router = express.Router();

// Mock data for search (replace with real API integrations later)
const mockFlights = [
  { id: 1, from: 'NYC', to: 'LAX', price: 200, date: '2025-04-01', airline: 'Delta', duration: '5h 30m', departureTime: '08:00 AM', arrivalTime: '11:30 AM' },
  { id: 2, from: 'LAX', to: 'NYC', price: 220, date: '2025-04-02', airline: 'American', duration: '5h 15m', departureTime: '09:00 AM', arrivalTime: '02:15 PM' },
  { id: 3, from: 'NYC', to: 'MIA', price: 150, date: '2025-04-03', airline: 'United', duration: '3h 10m', departureTime: '07:00 AM', arrivalTime: '10:10 AM' },
  { id: 4, from: 'MIA', to: 'LAX', price: 180, date: '2025-04-04', airline: 'JetBlue', duration: '6h 00m', departureTime: '10:00 AM', arrivalTime: '04:00 PM' },
];

const mockHotels = [
  { id: 1, name: 'Hotel A', location: 'NYC', price: 150, checkIn: '2025-04-01', rating: 4.5, amenities: ['Free Wi-Fi', 'Pool', 'Gym'] },
  { id: 2, name: 'Hotel B', location: 'LAX', price: 180, checkIn: '2025-04-01', rating: 4.0, amenities: ['Free Breakfast', 'Spa', 'Parking'] },
  { id: 3, name: 'Hotel C', location: 'MIA', price: 120, checkIn: '2025-04-02', rating: 3.8, amenities: ['Free Wi-Fi', 'Pet Friendly'] },
  { id: 4, name: 'Hotel D', location: 'NYC', price: 200, checkIn: '2025-04-03', rating: 4.7, amenities: ['Free Wi-Fi', 'Pool', 'Bar'] },
];

const mockCars = [
  { id: 1, type: 'Economy', location: 'NYC', price: 50, pickupDate: '2025-04-01', company: 'Hertz', features: ['4 Seats', 'Automatic', 'AC'] },
  { id: 2, type: 'SUV', location: 'LAX', price: 80, pickupDate: '2025-04-01', company: 'Enterprise', features: ['5 Seats', 'Automatic', '4WD'] },
  { id: 3, type: 'Luxury', location: 'MIA', price: 120, pickupDate: '2025-04-02', company: 'Avis', features: ['4 Seats', 'Automatic', 'Leather Seats'] },
  { id: 4, type: 'Compact', location: 'NYC', price: 60, pickupDate: '2025-04-03', company: 'Budget', features: ['4 Seats', 'Manual', 'AC'] },
];

// Search Flights
router.get('/flights', (req, res) => {
  const { from, to, date } = req.query;
  const results = mockFlights.filter(
    (flight) =>
      (!from || flight.from === from) &&
      (!to || flight.to === to) &&
      (!date || flight.date === date)
  );
  res.json(results);
});

// Search Hotels
router.get('/hotels', (req, res) => {
  const { destination, checkIn } = req.query;
  const results = mockHotels.filter(
    (hotel) =>
      (!destination || hotel.location === destination) &&
      (!checkIn || hotel.checkIn === checkIn)
  );
  res.json(results);
});

// Search Car Rentals
router.get('/cars', (req, res) => {
  const { location, pickupDate } = req.query;
  const results = mockCars.filter(
    (car) =>
      (!location || car.location === location) &&
      (!pickupDate || car.pickupDate === pickupDate)
  );
  res.json(results);
});

// Create a Booking and Process Payment
router.post('/book', async (req, res) => {
  const { userId, type, details, amount, paymentMethodId } = req.body;
  const db = req.app.get('db');
  const stripe = req.app.get('stripe');

  console.log('Received booking request from frontend:', req.body);

  try {
    console.log('Creating Stripe Payment Intent with paymentMethodId:', paymentMethodId);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'http://localhost:5173/confirmation',
    });
    console.log('Payment Intent created:', paymentIntent);

    console.log('Inserting booking into MySQL...');
    const [result] = await db.execute(
      'INSERT INTO bookings (user_id, type, details, amount, payment_status, payment_intent_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        userId,
        type,
        JSON.stringify(details),
        amount,
        paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
        paymentIntent.id,
      ]
    );
    console.log('Booking inserted with ID:', result.insertId);

    res.json({
      success: true,
      bookingId: result.insertId,
      paymentStatus: paymentIntent.status,
    });
  } catch (error) {
    console.error('Error in /book endpoint:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;