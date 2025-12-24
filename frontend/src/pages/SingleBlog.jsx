import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Skeleton,
  Button,
  Card,
  CardMedia,
  CardContent,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { blogsApi } from '../api/blogApi';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await blogsApi.getById(id);
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load the article. It might not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // --- Loading State ---
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Skeleton variant="text" width={100} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={60} width="90%" sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={80} />
          </Box>
        </Stack>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4, mb: 4 }} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  // --- Error State ---
  if (error || !blog) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || "Blog post not found"}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/blogs')}>
          Back to Blogs
        </Button>
      </Container>
    );
  }

  // --- Main Content ---
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>

      {/* 1. Top Navigation */}
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary', mb: 2 }}
        >
          Back
        </Button>
      </Container>

      {/* 2. Header Section */}
      <Container maxWidth="md">
        <Chip
          label={blog.category || 'General'}
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            fontWeight: 700,
            mb: 3,
            fontSize: '0.875rem',
            height: 28,
          }}
        />

        <Typography 
            variant="h3" 
            component="h1" 
            fontWeight={800} 
            gutterBottom 
            sx={{ 
                lineHeight: 1.2, 
                fontSize: { xs: '2rem', md: '3rem' },
                color: 'text.primary'
            }}
        >
          {blog.title}
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, lineHeight: 1.6 }}>
          {blog.excerpt}
        </Typography>

        {/* Author & Meta Data */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={3}
          sx={{ mb: 4 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={blog.authorAvatar} sx={{ width: 48, height: 48 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                {blog.author}
              </Typography>
              <Stack direction="row" spacing={2} color="text.secondary">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CalendarTodayIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">
                    {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Unknown'}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{blog.readTime}</Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: 'text.secondary' }}><ShareIcon /></IconButton>
            <IconButton sx={{ color: 'text.secondary' }}><BookmarkBorderIcon /></IconButton>
          </Stack>
        </Stack>
      </Container>

      {/* 3. Hero Image */}
      <Container maxWidth="md" sx={{ mb: 6 }}>
        <Card elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: theme.shadows[4] }}>
          <CardMedia
            component="img"
            src={blog.image}
            alt={blog.title}
            sx={{
              width: '100%',
              maxHeight: 500,
              objectFit: 'cover',
            }}
          />
        </Card>
      </Container>

      {/* 4. Blog Body Content */}
      <Container maxWidth="md">
        <Paper 
            elevation={0} 
            sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 4, 
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[1]
            }}
        >
          <Box
            sx={{
              color: 'text.primary',
              lineHeight: 1.8,
              fontSize: '1.125rem',
              fontFamily: '"Inter", "Roboto", "sans-serif"',
              overflowWrap: 'break-word',

              // Images
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 3,
                my: 4,
                display: 'block',
                boxShadow: theme.shadows[3],
              },

              // Headings
              '& h1, & h2, & h3': {
                color: 'text.primary',
                fontWeight: 700,
                mt: 5,
                mb: 2,
                lineHeight: 1.3,
              },

              // Links
              '& a': {
                color: 'primary.main',
                textDecoration: 'underline',
                fontWeight: 500,
                '&:hover': { color: 'primary.dark' },
              },

              // Lists
              '& ul, & ol': { pl: 5, mb: 3 },
              '& li': { mb: 1.5 },

              // Blockquotes - Dynamic Styling
              '& blockquote': {
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                pl: 4,
                fontStyle: 'italic',
                color: 'text.secondary',
                my: 4,
                py: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
              },

              // Code Blocks
              '& pre': {
                bgcolor: theme.palette.mode === 'dark' ? '#111' : '#2d2d2d',
                color: '#f8f8f2',
                p: 3,
                borderRadius: 3,
                overflowX: 'auto',
                fontFamily: '"Fira Code", monospace',
                fontSize: '0.9rem',
                my: 3,
              },
              '& code': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.dark',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontFamily: '"Fira Code", monospace',
                fontSize: '0.9rem',
              },
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </Paper>

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
              {blog.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  color='primary'
                  sx={{ fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 6 }} />

        {/* 5. Author Bio */}
        <Card 
            elevation={0} 
            sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.05), 
                p: 4, 
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
        >
          <CardContent sx={{ p: 0 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar src={blog.authorAvatar} sx={{ width: 72, height: 72 }} />
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom color="text.primary">
                  About {blog.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Tech enthusiast and Senior Developer. Passionate about writing clean code and sharing knowledge with the community.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default SingleBlog; 