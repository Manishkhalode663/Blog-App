import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  Stack 
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log(formData);

    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      // 2. Call Signup from Context
      // We only send username, email, password (not confirmPassword)
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      showSnackbar({
        message: 'Account created successfully!',
        severity: 'success',
      }); 

      // 3. Redirect to Home on success
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      // Handle backend errors (e.g., "User already exists")
      setError(err.response?.data?.message || 'Failed to create account');
      showSnackbar({
        message: err.response?.data?.message || 'Failed to create account',
        severity: 'error',
      });   
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        
        <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join our community of developers
        </Typography>
        
        {/* Error Alert */}
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Stack spacing={2}>
            
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontWeight: 'bold', mt: 2 }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

          </Stack>
          
          <Box textAlign="center" sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                Sign In
              </Link>
            </Typography>
          </Box>

        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;