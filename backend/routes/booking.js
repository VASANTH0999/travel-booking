const express = require('express');
const router = express.Router();

// Search Flights
router.get('/flights', async (req, res) => {
  const { from, to, date } = req.query;
  const db = req.app.get('db');

  try {
    let query = 'SELECT * FROM flights WHERE 1=1';
    const params = [];

    if (from) {
      query += ' AND from_city = ?';
      params.push(from);
    }
    if (to) {
      query += ' AND to_city = ?';
      params.push(to);
    }
    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    const [results] = await db.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

// Search Hotels
router.get('/hotels', async (req, res) => {
  const { destination, checkIn } = req.query;
  const db = req.app.get('db');

  try {
    let query = 'SELECT * FROM hotels WHERE 1=1';
    const params = [];

    if (destination) {
      query += ' AND location = ?';
      params.push(destination);
    }
    if (checkIn) {
      query += ' AND check_in = ?';
      params.push(checkIn);
    }

    const [results] = await db.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error searching hotels:', error);
    res.status(500).json({ error: 'Failed to search hotels' });
  }
});

// Search Car Rentals
router.get('/cars', async (req, res) => {
  const { location, pickupDate } = req.query;
  const db = req.app.get('db');

  try {
    let query = 'SELECT * FROM cars WHERE 1=1';
    const params = [];

    if (location) {
      query += ' AND location = ?';
      params.push(location);
    }
    if (pickupDate) {
      query += ' AND pickup_date = ?';
      params.push(pickupDate);
    }

    const [results] = await db.execute(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error searching cars:', error);
    res.status(500).json({ error: 'Failed to search cars' });
  }
});

// Create a Booking and Process Payment
router.post('/book', async (req, res) => {
  const { userId, type, details, amount, paymentMethodId } = req.body;
  const db = req.app.get('db');
  const stripe = req.app.get('stripe');

  console.log('Received booking request from frontend:', req.body);

  try {
    // Verify user exists in profiles
    const [user] = await db.execute('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    if (!user.length) {
      return res.status(400).json({ success: false, error: 'User profile not found' });
    }

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

// Get User Profile
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const db = req.app.get('db');

  try {
    const [results] = await db.execute('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update User Profile
router.put('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { first_name, last_name, email, phone } = req.body;
  const db = req.app.get('db');

  try {
    const [result] = await db.execute(
      'UPDATE profiles SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE user_id = ?',
      [first_name, last_name, email, phone || null, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;