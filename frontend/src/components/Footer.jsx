import React from 'react';
import {
  Box, Container, Grid, Typography, Link, IconButton, TextField, Button, Stack, useTheme, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        // 1. Logic: Dark Mode -> Very Dark Grey | Light Mode -> Deep Teal
        bgcolor: theme.palette.mode === 'dark' ? '#0a0a0a' : 'rgba(15, 32, 39, 1)',
        color: 'white',
        py: 8,
        borderTop: `1px solid ${theme.palette.mode === 'dark' ? '#333' : 'rgba(255,255,255,0.1)'}`,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>

          {/* Brand */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>DevBlogs</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8 }}>
              Crafting digital experiences with precision.
            </Typography>

            <Stack direction="row" spacing={1} mt={3}>
              {[<FacebookIcon />, <TwitterIcon />, <InstagramIcon />, <LinkedInIcon />].map((icon, i) => (
                <IconButton key={i} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                  {icon}
                </IconButton>
              ))}
            </Stack>

            {/* Contact Info */}
            <Stack spacing={1.5} mt={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>+1 234 567 8900</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <Link href="mailto:support@devblogs.com" underline="none" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  support@devblogs.com
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationOnIcon fontSize="small" sx={{ opacity: 0.7 }} />
                <Typography variant="body2" sx={{ opacity: 0.7 }}>123 Dev St, Code City</Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Explore</Typography>
            <Stack spacing={1.5}>
              {['Home', 'About Us', 'Services', 'Portfolio'].map((item) => (
                <Link key={item} href="#" underline="none" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: theme.palette.primary.light } }}>
                  › {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Quick Links</Typography>
            <Stack spacing={1.5}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Support'].map((item) => (
                <Link key={item} href="#" underline="none" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: theme.palette.primary.light } }}>
                  › {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Resources</Typography>
            <Stack spacing={1.5}>
              {['Documentation', 'API Reference', 'Community', 'Blog'].map((item) => (
                <Link key={item} href="#" underline="none" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: theme.palette.primary.light } }}>
                  › {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Newsletter (Mini) */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Stay Updated</Typography>
            <Stack direction="row">
              <TextField
                placeholder="Email"
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px 0 0 4px',
                  input: { color: 'white' },
                  fieldset: { border: 'none' }
                }}
              />
              <Button variant="contained" sx={{ borderRadius: '0 4px 4px 0' }}>
                <SendIcon fontSize="small" />
              </Button>
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.5, mt: 1 }}>
              Get the latest posts delivered to your inbox.
            </Typography>
          </Grid>

        </Grid>

       

        

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 6, pt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            &copy; {new Date().getFullYear()} DevBlog. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" mt={1}>
            <Link href="#" underline="none" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Sitemap</Link>
            <Link href="#" underline="none" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Accessibility</Link>
            <Link href="#" underline="none" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Report an Issue</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
