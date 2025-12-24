import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Stack,
  Accordion, AccordionSummary, AccordionDetails,
  useTheme
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; 
import NewsLetter from '../components/NewsLetter';
import { blogsApi } from '../api/blogApi';
import { useNavigate } from 'react-router-dom';
import Faq from '../components/Faq';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await blogsApi.getAll({ limit: 6 });
        const results = data.results || data.data || [];
        setBlogs(results);
      } catch {
        console.error("Failed to load blogs");
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>

        {/* --- HERO SECTION --- */}
        <Box
          sx={{
            // Adaptive Gradient
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #000000 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            py: { xs: 8, md: 12 },
            px: 4,
            borderRadius: 4,
            textAlign: 'center',
            mb: 8,
            boxShadow: theme.shadows[10],
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '4rem' } }}
          >
            Welcome to DevBlog
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}
          >
            Discover stories, thinking, and expertise from writers on any topic.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/blogs')}
            sx={{
              bgcolor: 'background.paper',
              color: 'text.primary',
              fontWeight: 700,
              px: 5,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'background.default',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Start Reading
          </Button>
        </Box>

        {/* --- SECTION HEADER --- */} 
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Featured Posts
          </Typography>
          <Button endIcon={<ArrowForwardIcon />} color="primary" onClick={() => navigate('/blogs')}>
            View All
          </Button>
        </Stack>

        {/* --- BLOG GRID --- */}
        <Grid container spacing={4}>
          {blogs.map((post) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post._id} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'background.paper', // Dynamic card background
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8]
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={post.image}
                    alt={post.title}
                  />
                  <Chip
                    label={post.category || 'General'}
                    size="small"
                    color="primary"
                    sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 'bold' }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3" fontWeight="bold" color="text.primary">
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      overflow: 'hidden'
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/blogs/${post._id}`)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Read Article
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid> 

      </Container>
      <Box sx={{ mt: 8 }}>
        <NewsLetter />
      </Box>

      {/* FAQ Accordion */}
      <Box sx={{ mt: 6 }}>
        <Faq />
      </Box>
      
    </Box>
  );
};

export default Home; 