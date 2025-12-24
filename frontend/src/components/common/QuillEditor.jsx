import React from 'react';
// 1. CHANGE THIS IMPORT
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Box, FormHelperText, InputLabel } from '@mui/material';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list',
  'link', 'image'
];

const QuillEditor = ({ value, onChange, label, error, helperText, placeholder }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {label && (
        <InputLabel sx={{ mb: 1, fontWeight: 500, color: error ? 'error.main' : 'text.primary' }}>
          {label}
        </InputLabel>
      )}

      <Box sx={{ 
          '& .quill': { borderRadius: 2 },
          '& .ql-toolbar': {
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderColor: error ? '#d32f2f' : '#c4c4c4',
              bgcolor: '#f8f9fa'
          },
          '& .ql-container': {
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderColor: error ? '#d32f2f' : '#c4c4c4',
              minHeight: '300px',
              fontSize: '1rem',
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
          }
      }}>
          <ReactQuill 
              theme="snow"
              value={value || ''}
              onChange={onChange}
              modules={modules}
              formats={formats}
              placeholder={placeholder || "Write something amazing..."}
          />
      </Box>

      {helperText && (
        <FormHelperText error={error} sx={{ ml: 1.5, mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default QuillEditor;
