import React from 'react';
import { 
  Typography, 
  Container, 
  Grid, 
  Box, 
  Avatar, 
  Button, 
  Stack, 
  Paper, 
  Divider,
  Chip
} from '@mui/material';

// Icons
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import CodeIcon from '@mui/icons-material/Code';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      
      {/* 1. HERO HEADER */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ fontWeight: 800, mb: 2 }}
        >
          About <span style={{ color: '#1976d2' }}>DevBlog</span>
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.6 }}
        >
          We are dedicated to providing the best tutorials, insights, and resources 
          for modern developers. From React to Python, we cover it all.
        </Typography>
      </Box>

      {/* 2. MAIN BIO SECTION (Split Layout) */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4 }}>
        <Grid container spacing={6} alignItems="center">
          
          {/* Left Side: Image */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box 
              sx={{ 
                position: 'relative', 
                display: 'flex', 
                justifyContent: 'center' 
              }}
            >
              {/* Decorative Circle Background */}
              <Box 
                sx={{
                  position: 'absolute',
                  width: '300px',
                  height: '300px',
                  bgcolor: 'primary.light',
                  borderRadius: '50%',
                  opacity: 0.2,
                  zIndex: 0,
                  top: -20,
                  left: -20,
                }} 
              />
              <Avatar
                alt="Manish Khalode"
                src= "https://i.pravatar.cc/400?img=68"
                sx={{ 
                  width: 280, 
                  height: 280, 
                  zIndex: 1, 
                  boxShadow: 4,
                  border: '4px solid white'
                }}
              />
            </Box>
          </Grid>

          {/* Right Side: Content */}
          <Grid  size={{ xs: 12, md: 7 }}>
            <Typography variant="overline" color="primary" fontWeight="bold">
              Meet the Author
            </Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Hi, I'm Manish
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
              I am a passionate <strong>Full-Stack Developer</strong> specializing in Django and React. 
              I created this platform to document my journey and help others learn how to build 
              scalable web applications.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ color: 'text.secondary', mb: 4 }}>
              When I'm not coding, I'm exploring new technologies, contributing to open source, 
              or optimizing database queries for fun.
            </Typography>

            {/* Skills Chips */}
            <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
              {['React', 'Django', 'Python', 'MUI', 'PostgreSQL'].map((skill) => (
                <Chip key={skill} icon={<CodeIcon />} label={skill} variant="outlined" />
              ))}
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button variant="contained" startIcon={<EmailIcon />} size="large">
                Contact Me
              </Button>
              <Button variant="outlined" startIcon={<GitHubIcon />} size="large">
                Github
              </Button>
              <Button variant="outlined" startIcon={<LinkedInIcon />} size="large">
                LinkedIn
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* 3. STATS SECTION */}
      <Box sx={{ mt: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            { label: 'Articles Written', value: '50+' },
            { label: 'Happy Readers', value: '12k' },
            { label: 'Years Experience', value: '3+' },
          ].map((stat, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {stat.value}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

    </Container>
  );
};

export default About;