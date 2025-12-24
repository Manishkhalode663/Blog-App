import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  useTheme,
  alpha 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Faq = () => {
  const theme = useTheme();

  const faqs = [
    {
      question: "What is DevBlogs?",
      answer: "DevBlogs is a platform for developers to share insights, tutorials, and experiences. Whether you are a beginner or an expert, you can find valuable content here."
    },
    {
      question: "How can I contribute?",
      answer: "You can contribute by signing up for an account and creating new posts from your dashboard. We welcome tutorials, opinion pieces, and project showcases."
    },
    {
      question: "Is it free to use?",
      answer: "Yes, reading and writing on DevBlogs is completely free. We believe in open knowledge sharing for the developer community."
    },
    {
      question: "Can I edit my posts after publishing?",
      answer: "Absolutely! You can manage all your articles (edit, delete, or archive) directly from your personalized dashboard."
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: 10 }}>
      <Container maxWidth="md">
        
        {/* Section Header */}
        <Box textAlign="center" mb={6}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                p: 1.5, 
                borderRadius: '50%', 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                color: 'primary.main',
                mb: 2
              }}
            >
                <HelpOutlineIcon fontSize="large" />
            </Box>
            <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: 'text.primary' }}>
                Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
                Everything you need to know about the product and billing. Can’t find the answer you’re looking for? Please contact our team.
            </Typography>
        </Box>

        {/* Accordions */}
        <Box>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index}
              disableGutters 
              elevation={0}
              sx={{ 
                bgcolor: 'background.paper',
                mb: 2,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                '&:before': { display: 'none' }, // Hides default separator line
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme.shadows[2],
                    transform: 'translateY(-2px)'
                },
                '&.Mui-expanded': {
                    borderColor: 'primary.main',
                    boxShadow: theme.shadows[4]
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{ px: 3, py: 1 }}
              >
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

      </Container>
    </Box>
  );
}

export default Faq;