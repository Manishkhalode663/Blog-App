import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  useTheme,
  alpha,
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      showSnackbar({
        message: 'Welcome back!',
        severity: 'success',
      });
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      showSnackbar({
        message: 'Login failed. Please check your details.',
        severity: 'error',
      }); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
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
          {/* Logo / Icon */}
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 50, height: 50 }}>
            <LockOutlinedIcon />
          </Avatar>
          
          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1, color: 'text.primary' }}>
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back to DevBlog
          </Typography>
          
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default' // Matches theme background
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default'
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5, 
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: 2,
                // Gradient for primary button
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, .3)}`,
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ 
                    color: 'text.secondary', 
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s' 
                  }}>
                  Don't have an account? <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Sign Up</span>
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;