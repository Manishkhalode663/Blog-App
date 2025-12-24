import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment, 
  Stack,
  useTheme,
  alpha 
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const theme = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email) {
        console.log("Subscribed:", email);
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: theme.shadows[10],
            border: `1px solid ${theme.palette.divider}`,
            p: { xs: 4, md: 8 },
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          {/* Decorative Elements */}
          <Box 
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            }} 
          />
           <Box 
            sx={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
            }} 
          />

          <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            
            {/* Left Content */}
            <Grid size={{xs:12, md:7}}>
              <Stack direction="row" alignItems="center" spacing={2} mb={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Box 
                    sx={{ 
                        p: 1.5, 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)' 
                    }}
                >
                    <RocketLaunchIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Typography variant="overline" sx={{ color: 'white', letterSpacing: 2, fontWeight: 700 }}>
                    WEEKLY DIGEST
                </Typography>
              </Stack>

              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: 'white', fontSize: { xs: '2rem', md: '3rem' } }}>
                Join our community
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400, maxWidth: 600, mx: { xs: 'auto', md: 0 } }}>
                Get the latest articles, tutorials, and free resources delivered straight to your inbox every week.
              </Typography>
            </Grid>

            {/* Right Form */}
            <Grid size={{xs:12, md:5}} >
              <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(12px)',
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                 <Typography variant="subtitle1" fontWeight={700} color="white" mb={2}>
                    Subscribe for updates
                 </Typography>

                 <Stack spacing={2}>
                    <TextField
                        fullWidth
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                            },
                            input: { color: 'black' }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MarkEmailReadIcon sx={{ color: 'rgba(0,0,0,0.54)' }}   />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                        fullWidth
                        sx={{ 
                            bgcolor: 'black', 
                            color: 'white',
                            fontWeight: 700,
                            py: 1.5,
                            '&:hover': { bgcolor: '#333' }
                        }}
                    >
                        {subscribed ? "Thanks for Subscribing!" : "Subscribe Now"}
                    </Button>
                 </Stack>

                 <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 2, display: 'block', textAlign: 'center' }}>
                    No spam, unsubscribe anytime.
                 </Typography>
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsLetter;