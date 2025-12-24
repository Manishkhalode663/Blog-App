import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, CardContent, CardActions, Chip, Button,
    IconButton, Grid, Divider, Fade, Skeleton, CardMedia, Tooltip, Container, Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article'; // For empty state
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { blogsApi } from '../../api/blogApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DeleteBlogModal from '../../components/admin/DeleteBlogModal';

const MyDrafts = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Delete Modal State
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const fetchMyDrafts = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const data = await blogsApi.getByAuthor(user.username);
                // Filter client-side (ideally backend should handle this via /my-blogs endpoint)
                const myDrafts = data.filter(b => !b.publish);
                console.log(myDrafts);

                setBlogs(myDrafts);
            } catch (err) {
                console.error("Failed to fetch blogs");
            } finally {
                setLoading(false);
            }
        };
        fetchMyDrafts();
    }, [user]);

    const handleEdit = (id) => {
        navigate(`/dashboard/blog/edit/${id}`);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        try {
            await blogsApi.delete(deleteId);
            setBlogs(blogs.filter(b => b._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("Failed to delete");
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'start', sm: 'center' }, 
                mb: 5, 
                gap: 2 
            }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ color: 'primary.dark', mb: 0.5 }}>
                        My Articles
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your published content and drafts.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/dashboard/create')}
                    sx={{
                        px: 3,
                        py: 1.2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                    }}
                >
                    Write New Article
                </Button>
            </Box>

            {/* Loading State */}
            {loading ? (
                <Grid container spacing={3}>
                    {[...Array(4)].map((_, idx) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 1 }} />
                            <Skeleton width="60%" height={30} sx={{ mb: 1 }} />
                            <Skeleton width="40%" height={20} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Fade in={!loading} timeout={600}>
                    <Box>
                        {blogs.length > 0 ? (
                            <Grid container spacing={3}>
                                {blogs.map((blog) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={blog._id}>    
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                borderRadius: 3,
                                                border: '1px solid',
                                                borderColor: 'grey.100',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                transition: 'all 0.3s ease-in-out',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                                    borderColor: 'primary.light',
                                                    '& .blog-image': {
                                                        transform: 'scale(1.05)'
                                                    }
                                                },
                                            }}
                                        >
                                            {/* Image Area */}
                                            <Box sx={{ position: 'relative', overflow: 'hidden', height: 180 }}>
                                                <CardMedia
                                                    component="img"
                                                    className="blog-image"
                                                    image={blog.image || 'https://source.unsplash.com/random/800x600?technology'}
                                                    alt={blog.title}
                                                    sx={{
                                                        height: '100%',
                                                        width: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.5s ease',
                                                    }}
                                                />
                                                <Chip
                                                    label={blog.category}
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 12,
                                                        left: 12,
                                                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                                                        fontWeight: 700,
                                                        color: 'primary.main',
                                                        backdropFilter: 'blur(4px)',
                                                        boxShadow: 1
                                                    }}
                                                />
                                            </Box>

                                            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                                {/* Meta Info */}
                                                <Box sx={{ display: 'flex', gap: 2, mb: 1.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                        {new Date(blog.createdAt).toLocaleDateString()}
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                        {blog.readTime || '5 min'}
                                                    </Box>
                                                </Box>

                                                {/* Title */}
                                                <Typography 
                                                    variant="h6" 
                                                    fontWeight="bold" 
                                                    sx={{ 
                                                        mb: 1, 
                                                        lineHeight: 1.3,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        // minHeight: '2.6em' // Force 2 lines height alignment
                                                    }}
                                                >
                                                    {blog.title}
                                                </Typography>
                                                
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {blog.excerpt}
                                                </Typography>
                                            </CardContent>

                                            <Divider light />

                                            {/* Action Buttons */}
                                            <CardActions sx={{ p: 2, bgcolor: '#fafafa', justifyContent: 'space-between' }}>
                                                <Tooltip title="Edit Article">
                                                    <Button 
                                                        size="small" 
                                                        startIcon={<EditIcon />} 
                                                        onClick={() => handleEdit(blog._id)}
                                                        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="Delete Article">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleDeleteClick(blog._id)}
                                                        sx={{ 
                                                            color: 'text.disabled', 
                                                            '&:hover': { color: 'error.main', bgcolor: 'error.50' } 
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            // Empty State
                            <Paper 
                                elevation={2} 
                                sx={{ 
                                    p: 8, 
                                    textAlign: 'center', 
                                    borderRadius: 4, 
                                    bgcolor: 'grey.50',
                                    border: '2px dashed',
                                    borderColor: 'grey.300'
                                }}
                            >
                                <ArticleIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No blogs found
                                </Typography>
                                <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                                    You haven't published any articles yet. Share your thoughts with the world!
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => navigate('/dashboard/create')}
                                >
                                    Start Writing
                                </Button>
                            </Paper>
                        )}
                    </Box>
                </Fade>
            )}

            <DeleteBlogModal
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
            />
        </Container>
    );
};

export default MyDrafts;