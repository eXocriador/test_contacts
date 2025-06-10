import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Devices as DevicesIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: 'Lightning Fast',
    description:
      'Built with modern technologies for optimal performance and speed.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure by Design',
    description:
      'Your data is protected with industry-standard security measures.',
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 40 }} />,
    title: 'Responsive Design',
    description:
      'Works seamlessly across all your devices, from desktop to mobile.',
  },
  {
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    title: 'Modern Stack',
    description:
      'Built with React, Node.js, and MongoDB for a robust experience.',
  },
];

const Home = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Contact Manager
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 400,
                }}
              >
                A modern solution for managing your contacts with style and
                efficiency.
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    bottom: -20,
                    left: -20,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    zIndex: 0,
                  },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Features at a Glance
                  </Typography>
                  <Grid container spacing={2}>
                    {features.map((feature, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          {feature.icon}
                          <Typography variant="subtitle1" sx={{ mt: 1 }}>
                            {feature.title}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h2" align="center" sx={{ mb: 8, fontWeight: 700 }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                  bgcolor: 'background.paper',
                  borderRadius: 4,
                }}
              >
                <Box
                  sx={{
                    color: 'primary.main',
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: { xs: 8, md: 12 },
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of users who trust our platform
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              sx={{ mr: 2 }}
            >
              Sign Up Now
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
