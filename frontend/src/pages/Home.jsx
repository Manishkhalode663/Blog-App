import React from 'react';
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
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Divider
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NewsLetter from '../components/NewsLetter';
import { blogsApi } from '../api/blogApi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call the API function to get featured blogs
        const data = await blogsApi.getFeaturedBlogs(6);
        setBlogs(data.results? data.results:[]); 
      } catch {
        console.error("Failed to load blogs");
      }
    };

    fetchData();
  }, []);
 


  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>

        {/* --- HERO SECTION --- */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: { xs: 6, md: 10 },
            px: 4,
            borderRadius: 4,
            textAlign: 'center',
            mb: 8,
            boxShadow: '0px 10px 30px rgba(118, 75, 162, 0.3)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
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
              bgcolor: 'white',
              color: '#764ba2',
              fontWeight: 700,
              px: 5,
              py: 1.5,
              borderRadius: 2,
              boxShadow: '0 8px 20px rgba(118, 75, 162, 0.35)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: '#f0f0f0',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 28px rgba(118, 75, 162, 0.45)'
              }
            }}
          >
            Start Reading
          </Button>
        </Box>

        {/* --- GRID HEADER --- */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            Featured Posts
          </Typography>
          <Button endIcon={<ArrowForwardIcon />} color="primary" href='/blogs'>View All</Button>
        </Stack>

          
        {/* --- THE PERFECT GRID --- */}
        <Grid container spacing={2}>
          {blogs.map((post) => (
            // 1. Grid Item: Added 'display="flex"' to ensure the child Card fills the height
            <Grid size={{ sm: 12, md: 6, xl: 4 }} key={post._id} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  width: '100%', // Fills the grid width
                  display: 'flex', // Enables flexbox inside the card
                  flexDirection: 'column', // Stacks Image -> Content -> Button vertically
                  borderRadius: 2,
                  boxShadow: 1,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 5
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }} // Ensures image doesn't stretch weirdly
                  />
                  <Chip
                    label={post.category}
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 'bold',
                      boxShadow: 2
                    }}
                  />
                </Box>

                {/* 2. Card Content: 'flexGrow: 1' pushes the footer to the bottom */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3" fontWeight="bold">
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      // Line Clamp Logic: Limits text to 3 lines
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                </CardContent>

                {/* 3. Card Actions */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button size="small" variant="text" color="primary" sx={{ fontWeight: 'bold' }} 
                        onClick={()=>{navigate(`/blogs/${post._id || post.id}`)}}
                  >
                    Read Article
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
      <NewsLetter />
    </>
  );
};

export default Home;
