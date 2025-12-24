import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

// Smooth slide animation from the right side
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const showSnackbar = (msg, type = 'success') => {
    // 1. Safety Check: Ensure msg is a string
    let text = msg;
    
    if (typeof msg === 'object' && msg !== null) {
        text = msg.message || msg.error || JSON.stringify(msg);
    }

    setMessage(text);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      
      <Snackbar 
        open={open} 
        autoHideDuration={4000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={SlideTransition} // ✅ Added Animation
        sx={{
            bottom: { xs: 16, sm: 24 }, // Responsive spacing from bottom
            right: { xs: 16, sm: 24 }   // Responsive spacing from right
        }}
      >
        <Alert 
            onClose={handleClose} 
            severity={severity} 
            variant="filled" 
            elevation={6} // Adds depth
            sx={{ 
                width: '100%', 
                minWidth: '300px', // Prevents it from looking too thin
                fontWeight: 500,   // Cleaner font weight
                fontSize: '0.95rem',
                borderRadius: 2,   // Modern rounded corners
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)', // Modern soft shadow
                alignItems: 'center',
                '& .MuiAlert-icon': {
                    fontSize: 24, // Slightly larger icon
                    opacity: 0.9
                }
            }}
        >
          {String(message)} 
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};