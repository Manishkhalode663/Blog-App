import React, { memo } from 'react';
import {
    Box, Typography, Card, CardContent, CardActions, Chip, Button,
    IconButton, Grid, Divider, CardMedia, Tooltip, useTheme, alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

const DraftBlogCard = memo(({ blog, onEdit, onDelete }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
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
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '4.5em' // Force 3 lines height alignment
                    }}
                >
                    {blog.content}
                </Typography>
            </CardContent>

            <CardActions sx={{ p: 2.5, pt: 0, justifyContent: 'flex-end' }}>
                <Tooltip title="Edit Draft" arrow>
                    <IconButton onClick={() => onEdit(blog._id)} size="small" sx={{ color: 'primary.main' }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Draft" arrow>
                    <IconButton onClick={() => onDelete(blog._id)} size="small" color="error">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
});

export default DraftBlogCard;