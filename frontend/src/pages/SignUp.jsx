import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  Stack,
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext'; // FIXED: Imported Snackbar

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
  const { showSnackbar } = useSnackbar(); // FIXED: Initialized Hook
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      showSnackbar({
        message: 'Account created successfully! Welcome aboard.',
        severity: 'success',
      }); 

      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      const msg = err.response?.data?.message || 'Failed to create account';
      setError(msg);
      showSnackbar({ message: msg, severity: 'error' });   
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '90vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="xs">
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderRadius: 4,
            bgcolor: 'background.paper',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        > 

          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ color: 'text.primary', mt: 1 }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join our community of developers
          </Typography>
          
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.default' } }}
              />

              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.default' } }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.default' } }}
              />

              <TextField
                required
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.default' } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                    py: 1.5, 
                    fontWeight: 'bold', 
                    mt: 1,
                    borderRadius: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                    boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, .3)}`,
                }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

            </Stack>
            
            <Box textAlign="center" sx={{ mt: 3 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}>
                  Already have an account? <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Sign In</span>
                </Typography>
              </Link>
            </Box>

          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;