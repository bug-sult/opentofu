import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';
import keycloak from '../keycloak';

function Login() {
  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <MovieIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography component="h1" variant="h4" gutterBottom>
              Movie Library
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Welcome to your personal movie collection. Please sign in to continue.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{ mt: 2, mb: 2, minWidth: 200 }}
            >
              Sign In with Keycloak
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
