import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Box, Paper } from '@mui/material';
import { ContactPhone, Security, Speed } from '@mui/icons-material';

export const LandingPage = () => {
  return (
    <Box sx={{ py: 8 }}>
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Contact Manager
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A modern solution for managing your contacts efficiently and securely
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <ContactPhone
                sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
              />
              <Typography variant="h5" component="h2" gutterBottom>
                Easy Contact Management
              </Typography>
              <Typography color="text.secondary">
                Organize and manage your contacts with an intuitive interface
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Secure & Private
              </Typography>
              <Typography color="text.secondary">
                Your data is protected with industry-standard security measures
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Speed sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Fast & Efficient
              </Typography>
              <Typography color="text.secondary">
                Quick access to your contacts with powerful search and filter
                options
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to get started?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Join thousands of users who trust Contact Manager
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Sign Up Now
        </Button>
      </Container>
    </Box>
  );
};
