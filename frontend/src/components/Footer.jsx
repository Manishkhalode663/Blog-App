import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton, 
  TextField, 
  Button, 
  Stack 
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        // 1. Background Color & Gradient
        background: 'rgba(15, 32, 39, 1)', // Translucent deep teal base
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        color: '#ffffff',
        py: 8,
        pt: 10,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        position: 'relative',
        // clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0% 100%)', // Optional: Slanted top edge
        mt: 'auto',
        stickyFooter: true,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          
          {/* Column 1: Brand & About */}
          <Grid item sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }} size={{ xs: 12, sm: 6  }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ letterSpacing: 1 }}>
              DevBlogs 
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
              Crafting digital experiences   with precision and passion. 
              We build scalable solutions for modern businesses.
            </Typography>
            
            <Stack direction="row" spacing={1} mt={3}>
              {[{icon:<FacebookIcon />,color:'#0852f4ff'},{icon:<TwitterIcon />,color:'#1da1f2'},{icon:<InstagramIcon />,color:'#e4405fff'},{icon:<LinkedInIcon />,color:'#0077b5'}].map((icon, index) => (
                <IconButton 
                  key={index}
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      bgcolor: icon.color, 
                      transform: 'translateY(-3px)' 
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {icon.icon}
                </IconButton>
              ))}
            </Stack>

          </Grid>

          {/* Column 2: Navigation Links */}
          <Grid item sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }} size={{ xs: 12, sm: 6, md:2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Explore
            </Typography>
            <Stack spacing={1.5}>
              {['Home', 'About Us', 'Services', 'Portfolio', 'Contact'].map((item) => (
                <Link 
                  href="#" 
                  key={item} 
                  underline="none"
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.95rem',
                    transition: '0.3s',
                    '&:hover': { 
                      color: '#1976d2', 
                      pl: 1 // Slide right effect
                    }
                  }}
                >
                  › {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Column 3: Newsletter */}
          <Grid item sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }} size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Stay Updated
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 2 }}>
              Join 10,000+ others and get our latest articles.
            </Typography>
            
            <Stack direction="row" spacing={0}>
              <TextField
                variant="outlined"
                placeholder="Email address"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px 0 0 4px',
                  input: { color: 'white' },
                  fieldset: { border: 'none' },
                  width: '100%'
                }}
              />
              <Button 
                variant="contained" 
                color="primary"
                disableElevation
                sx={{ 
                  borderRadius: '0 4px 4px 0', 
                  minWidth: '50px' 
                }}
              >
                <SendIcon fontSize="small" />
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Divider & Copyright */}
        <Box 
          sx={{ 
            borderTop: '1px solid rgba(255,255,255,0.1)', 
            mt: 8, 
            pt: 4, 
            display: 'flex', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            &copy; {new Date().getFullYear()} BrandName. All rights reserved.
          </Typography>
          
          <Stack direction="row" spacing={3}>
            <Link href="#" underline="hover" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Privacy Policy</Link>
            <Link href="#" underline="hover" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Terms of Service</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;