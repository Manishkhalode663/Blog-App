import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Paper, Typography, TextField, Button, Box, MenuItem, Stack,
  Alert, InputLabel, Autocomplete, Chip, IconButton, Skeleton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../context/AuthContext';
import { blogsApi } from '../../api/blogApi';
import QuillEditor from '../../components/common/QuillEditor';
import { useSnackbar } from '../../context/SnackbarContext';

const CATEGORIES = ['Technology', 'Design', 'Coding', 'Business', 'Lifestyle', 'Travel'];
const READ_TIME_OPTIONS = ['1 min read', '3 min read', '5 min read', '10 min read'];
const BLOG_TAGS = [
  'React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Express', 'MongoDB', 'Firebase',
  'UI/UX', 'Responsive', 'Frontend', 'Backend', 'Full-Stack', 'API', 'GraphQL', 'REST',
  'Authentication', 'Security', 'Performance', 'SEO', 'Accessibility', 'Testing', 'DevOps',
  'Git', 'GitHub', 'VS Code', 'Debugging', 'Deployment', 'Cloud', 'AWS', 'Vercel'
];

const initialFormData = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Technology',
  readTime: '5 min read',
  tags: [],
  status: 'published',
  scheduleDate: '',
  image: '',
  authorAvatar: ''
};

const STATUS_OPTIONS = [{
  value: 'published',
  label: 'Published'
}, {
  value: 'draft',
  label: 'Draft'
}, {
  value: 'scheduled',
  label: 'Scheduled'
}];

const CreateBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('published');

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleTagsChange = useCallback((_, newValue) => {
    setFormData(prev => ({ ...prev, tags: newValue }));
  }, []);

  const handleContentChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, content: value }));
  }, []);

  const handleStatusChange = useCallback((e) => {
    setStatus(e.target.value);
    setFormData(prev => ({ ...prev, status: e.target.value })); 
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  const clearImage = useCallback((e) => {
    e.stopPropagation();
    setImageFile(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const isContentInvalid = useMemo(() => {
    if (!formData.content) return false;
    const plainText = formData.content.replace(/<[^>]+>/g, '').trim();
    return plainText.length > 0 && plainText.length < 50;
  }, [formData.content]);

  const handleSubmit = useCallback(async (e, isDraft = false) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!imageFile) {
      setError('Please upload a cover image.');
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') value.forEach(tag => payload.append('tags', tag));
        else payload.append(key, value);
      }); 
      if (status === 'scheduled') {
        payload.set('scheduleDate', formData.scheduleDate);
      }
      payload.append('author', user?.username || 'Admin');
      payload.append('authorAvatar', user?.avatar || '');
      payload.append('image', imageFile);

      await blogsApi.create(payload);
      showSnackbar('Blog post created successfully!', 'success');
      navigate('/dashboard/my-blogs');
    } catch {
      setError('Failed to create blog. Please try again.');
      showSnackbar('Failed to create blog. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [formData, imageFile, user, navigate, showSnackbar, status]);

  const skeleton = <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />;

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          Write New Article
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7, xl: 8 }}  >
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={4}>
                <Box>
                  <InputLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>Article Title</InputLabel>
                  <TextField
                    name="title"
                    fullWidth
                    placeholder="Enter a catchy title..."
                    value={formData.title}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Box>

                <Box>
                  <InputLabel sx={{ mb: 1, fontWeight: 500, color: 'text.primary' }}>Tags</InputLabel>
                  <Autocomplete
                    multiple
                    freeSolo
                    id="tags-autocomplete"
                    options={BLOG_TAGS}
                    value={formData.tags}
                    onChange={handleTagsChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="filled"
                          color="primary"
                          label={option}
                          {...getTagProps({ index })}
                          key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type and press Enter"
                        variant="outlined"
                      />
                    )}
                  />
                </Box>

                   <Box>
                  <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Excerpt</InputLabel>
                  <TextField
                    name="excerpt"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="A short summary..."
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>

                <Box>
                  <QuillEditor
                    label="Content"
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your story here..."
                    error={isContentInvalid}
                    helperText={isContentInvalid ? 'Content must be at least 50 characters' : ''}
                    height={400}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid  size={{ xs: 12, md:5,xl:4 }}
             
            sx={{ position: { lg: 'sticky' }, top: { lg: 24 }, alignSelf: 'flex-start' }}
          >
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                Publishing Details
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Cover Image</InputLabel>
                  <Box
                    onClick={() => !preview && fileInputRef.current?.click()}
                    sx={{
                      border: '2px dashed',
                      borderColor: preview ? 'transparent' : 'divider',
                      borderRadius: 2,
                      p: preview ? 0 : 4,
                      textAlign: 'center',
                      cursor: preview ? 'default' : 'pointer',
                      bgcolor: preview ? 'transparent' : 'background.default',
                      position: 'relative',
                      transition: '0.2s',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    {preview ? (
                      <Box sx={{ position: 'relative', width: '100%', height: 200 }}>
                        <Box
                          component="img"
                          src={preview}
                          alt="Cover"
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
                        />
                        <IconButton
                          onClick={clearImage}
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', boxShadow: 1 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <>
                        <CloudUploadIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body1" color="primary" fontWeight={600}>
                          Drop or select file
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          PNG, JPG up to 5MB
                        </Typography>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      hidden
                      accept="image/*"
                    />
                  </Box>
                </Box>

                <Box>
                  <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Category</InputLabel>
                  <TextField
                    select
                    name="category"
                    fullWidth
                    value={formData.category}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    {CATEGORIES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box>
                  <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Status</InputLabel>
                  <TextField
                    select
                    name="status"
                    fullWidth
                    value={status}
                    onChange={handleStatusChange}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                

                {status === 'scheduled' && (
                  <Box>
                    <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Schedule Date & Time</InputLabel>
                    <TextField
                      type="datetime-local"
                      fullWidth
                      value={formData.scheduleDate}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, scheduleDate: e.target.value }))
                      }
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Box>
                )}

                <Box>
                  <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Read Time</InputLabel>
                  <Autocomplete
                    freeSolo
                    options={READ_TIME_OPTIONS}
                    value={formData.readTime}
                    onInputChange={(_, val) => setFormData(prev => ({ ...prev, readTime: val }))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Box> 

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                   

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ flex: 1, py: 1.5, borderRadius: 3, fontWeight: 600, textTransform: 'none' }}
                  >
                    {loading ? 'Saving...' : 'Save Article'}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateBlog;
