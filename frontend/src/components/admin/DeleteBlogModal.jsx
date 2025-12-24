import React, { forwardRef } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogActions, 
    Button, 
    Box, 
    Typography, 
    IconButton,
    Zoom
} from '@mui/material';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import CloseIcon from '@mui/icons-material/Close';

// smooth pop-up animation
const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

const DeleteBlogModal = ({ open, onClose, onConfirm }) => {
  
  return (
    <Dialog 
        open={open} 
        onClose={onClose}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
            sx: {
                borderRadius: 4, // More rounded modern look
                p: 2,
                width: '100%',
                maxWidth: 420,
                boxShadow: (theme) => theme.shadows[20], // Deep shadow for focus
                backgroundImage: 'none'
            }
        }}
        slotProps={{
            backdrop: {
                sx: { 
                    backdropFilter: 'blur(4px)', 
                    backgroundColor: 'rgba(25, 30, 45, 0.4)' 
                }
            }
        }}
    >
      {/* Top Right Close Button */}
      <IconButton 
        onClick={onClose}
        sx={{ 
            position: 'absolute', 
            right: 12, 
            top: 12, 
            color: 'text.disabled',
            transition: 'all 0.2s',
            '&:hover': { 
                color: 'text.primary', 
                bgcolor: 'action.hover',
                transform: 'rotate(90deg)' 
            }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogContent sx={{ textAlign: 'center', pb: 2, pt: 4, px: 2 }}>
        
        {/* Animated Warning Icon */}
        <Box 
            sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: (theme) => theme.palette.error.lighter || '#fee2e2', // Soft red background
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                color: 'error.main',
                boxShadow: '0 0 0 8px rgba(239, 68, 68, 0.08)' // Subtle outer ring
            }}
        >
            <DeleteForeverRoundedIcon sx={{ fontSize: 36 }} />
        </Box>

        <Typography variant="h5" fontWeight={800} gutterBottom color="text.primary">
            Delete Article?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: '85%', mx: 'auto' }}>
            Are you sure you want to remove this post?
            <Box component="span" display="block" color="error.main" fontWeight={600} mt={0.5}>
                This action cannot be undone.
            </Box>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 1.5, flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
        <Button 
            onClick={onClose} 
            color="inherit" 
            fullWidth
            sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 600,
                color: 'text.secondary',
                bgcolor: 'action.hover',
                py: 1.2,
                '&:hover': { bgcolor: 'action.selected', color: 'text.primary' }
            }}
        >
            Cancel
        </Button>
        <Button 
            onClick={onConfirm} 
            color="error" 
            variant="contained"
            fullWidth
            disableElevation
            sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 700,
                py: 1.2,
                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.25)',
                '&:hover': {
                    bgcolor: 'error.dark',
                    boxShadow: '0 6px 16px rgba(211, 47, 47, 0.35)',
                }
            }}
        >
            Yes, Delete It
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBlogModal;