import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' }
];
const initialFormData = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Technology',
  readTime: '5 min read',
  tags: [],
  status: 'draft',
  scheduleDate: '' // Initialize as empty string for controlled input
};

// --- Helper: Convert UTC/ISO Date to "YYYY-MM-DDTHH:mm" (Local Input Format) ---
const formatForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  
  // Get local components to avoid UTC shift
  const pad = (num) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch existing data
  useEffect(() => {
    let cancelled = false;
    const fetchBlog = async () => {
      try {
        const data = await blogsApi.getById(id);
        if (!cancelled) {
          setFormData({
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            readTime: data.readTime,
            tags: data.tags || [],
            status: data.status || 'draft',
            // ✅ FIX: Format the incoming date correctly for the input field
            scheduleDate: data.scheduledAt ? formatForInput(data.scheduledAt) : ''
          });
          setPreview(data.image || '');
        }
      } catch {
        if (!cancelled) setError('Could not load blog data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBlog();
    return () => (cancelled = true);
  }, [id]);

  // Cleanup preview URL
  useEffect(() => {
    return () => preview && !preview.startsWith('http') && URL.revokeObjectURL(preview);
  }, [preview]);

  // Handlers
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleTagsChange = useCallback((_, newValue) => {
    setFormData((prev) => ({ ...prev, tags: newValue }));
  }, []);

  const handleContentChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  }, []);

  const handleStatusChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, status: e.target.value }));
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

  // Validation
  const contentError = useMemo(() => {
    if (!formData.content) return false;
    const plainText = formData.content.replace(/<[^>]+>/g, '').trim();
    return plainText.length > 0 && plainText.length < 50;
  }, [formData.content]);

  // Submit
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const payload = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
          // Skip scheduleDate here, we handle it manually below
          if (key === 'scheduleDate') return; 
          
          if (key === 'tags') val.forEach((tag) => payload.append('tags', tag));
          else payload.append(key, val);
        });

        // ✅ FIX: Handle Schedule Date Conversion
        if (formData.status === 'scheduled' && formData.scheduleDate) {
            // The input is "YYYY-MM-DDTHH:mm" (Local Time)
            // creating new Date() from this automatically uses local timezone
            // then .toISOString() converts it to UTC for the backend.
            const dateObj = new Date(formData.scheduleDate);
            payload.append('scheduleDate', dateObj.toISOString());
        } else {
            payload.append('scheduleDate', ''); // Clear it if not scheduled
        }

        console.log("Submitting formData : ", formData);
        
        payload.append('author', user?.username || 'Admin');
        payload.append('authorAvatar', user?.avatar || '');
        if (imageFile) payload.append('image', imageFile);

        const response = await blogsApi.update(id, payload);
        console.log("Update Response:", response);

        const message = response?.data?.message || 'Blog updated successfully!';
        showSnackbar(message, 'success');
        navigate('/dashboard/my-blogs');
      } catch (err) {
        console.error(err);
        const message = err?.response?.data?.message || 'Failed to update blog. Please try again.';
        setError(message);
        showSnackbar(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [formData, imageFile, user, id, navigate, showSnackbar]
  );

  // Skeleton loader while fetching
  if (loading && !formData.title)
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={40} width={180} sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid size={{xs:12, md:7, xl:8}}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" height={300} />
            </Paper>
          </Grid>
          <Grid size={{xs:12, md:5, xl:4}}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={56} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          Edit Article
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid size={{xs:12, md:7, xl:8}}>
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
                    error={contentError}
                    helperText={contentError ? 'Content must be at least 50 characters' : ''}
                    height={400}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{xs:12, md:5, xl:4}} 
            sx={{ position: { md: 'sticky' }, top: { md: 24 }, alignSelf: 'flex-start' }}
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
                    value={formData.status}
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

                {formData.status === 'scheduled' && (
                  <Box>
                    <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Schedule Date & Time</InputLabel>
                    <TextField
                      type="datetime-local"
                      name="scheduleDate"
                      fullWidth
                      value={formData.scheduleDate}
                      onChange={handleChange}
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
                    onInputChange={(_, val) => setFormData((prev) => ({ ...prev, readTime: val }))}
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

export default EditBlog;
