import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon, Sort as SortIcon, Logout as LogoutIcon } from '@mui/icons-material';
import axios from 'axios';
import keycloak from '../keycloak';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function MovieLibrary() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [openDialog, setOpenDialog] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    genre: '',
    rating: 0,
    year: '',
    description: ''
  });

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, [selectedGenre, sortBy, sortOrder]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/movies`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        },
        params: {
          genre: selectedGenre === 'all' ? undefined : selectedGenre,
          sortBy,
          order: sortOrder
        }
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/genres`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleAddMovie = async () => {
    try {
      await axios.post(`${API_URL}/api/movies`, newMovie, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
      setOpenDialog(false);
      setNewMovie({ title: '', genre: '', rating: 0, year: '', description: '' });
      fetchMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Movie Library
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Genre</InputLabel>
            <Select
              value={selectedGenre}
              label="Genre"
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <MenuItem value="all">All Genres</MenuItem>
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>{genre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}>
            <SortIcon />
          </IconButton>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add Movie
          </Button>
        </Box>

        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {movie.genre} • {movie.year}
                  </Typography>
                  <Rating value={movie.rating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {movie.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteMovie(movie.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Movie</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={newMovie.title}
              onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Genre"
              fullWidth
              value={newMovie.genre}
              onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Year"
              type="number"
              fullWidth
              value={newMovie.year}
              onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
            />
            <Box sx={{ mt: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={newMovie.rating}
                precision={0.5}
                onChange={(event, newValue) => {
                  setNewMovie({ ...newMovie, rating: newValue });
                }}
              />
            </Box>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={newMovie.description}
              onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddMovie} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default MovieLibrary;
