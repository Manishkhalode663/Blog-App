import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment 
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SendIcon from '@mui/icons-material/Send';

const NewsLetter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your subscription logic here (e.g., API call)
    console.log("Subscribed with:", email);
    alert(`Thanks for subscribing with ${email}!`);
    setEmail('');
  };

  return (
    <Box 
      sx={{ 
        bgcolor: '#f5f7fa', // Light grey background for the section
        py: 8 
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            background: 'linear-gradient(to right, #2b2b2bff, #0080ffba)', // Dark Blue to Teal Gradient
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Circle in Background */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              zIndex: 0
            }}
          />

          <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            
            {/* Left Side: Text */}
            <Grid   size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Subscribe to our Newsletter
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 500 }}>
                Get the latest news, updates, and special offers delivered directly to your inbox. No spam, we promise.
              </Typography>
            </Grid>

            {/* Right Side: Input Form */}
            <Grid  size={{ xs: 12, md: 6 }}>
              <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 2 
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    '& .MuiFilledInput-root': {
                      bgcolor: 'white',
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.08)',
                      paddingRight: '12px',
                      '&:hover': { bgcolor: 'white' },
                      '&.Mui-focused': { 
                        bgcolor: 'white',
                        boxShadow: '0 0 0 3px rgba(118,75,162,0.2)'
                      }
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      padding: '14px 12px'
                    }
                  }}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mt: '0 !important' , color: '#764ba2 !important' }}>
                        <MailOutlineIcon sx={{ color: '#764ba2' }} />
                      </InputAdornment>
                    )
                  }}
                />

                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon />}
                  sx={{
                    bgcolor: '#111', // Black button for contrast
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#333',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsLetter;
