// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        email: formData.email,
        password: formData.password,
      });
      console.log('Register response:', response.data);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', response.data.userId); 
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1>Register for Travel Booking</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            disabled={loading}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;