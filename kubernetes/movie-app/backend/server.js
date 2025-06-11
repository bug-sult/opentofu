const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'movieapp',
  host: process.env.DB_HOST || 'postgres-service',
  database: process.env.DB_NAME || 'moviedb',
  password: process.env.DB_PASSWORD || 'movieapp123',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Session configuration
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'movie-app-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Keycloak configuration
const keycloak = new Keycloak({ store: memoryStore }, {
  realm: 'movie-realm',
  'auth-server-url': process.env.KEYCLOAK_URL || 'http://localhost:30082',
  'ssl-required': 'external',
  resource: 'movie-app',
  'public-client': true,
  'confidential-port': 0
});

app.use(keycloak.middleware());

// Initialize database
async function initDatabase() {
  try {
    // Create movies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
        year INTEGER,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if movies already exist
    const result = await pool.query('SELECT COUNT(*) FROM movies');
    if (parseInt(result.rows[0].count) === 0) {
      // Insert initial movies
      const movies = [
        { title: 'One Night in Paris', genre: 'Drama', rating: 6.5, year: 2014, description: 'A romantic drama set in Paris' },
        { title: 'Pulp Fiction', genre: 'Crime', rating: 8.9, year: 1994, description: 'Quentin Tarantino masterpiece' },
        { title: 'Scarface', genre: 'Crime', rating: 8.3, year: 1983, description: 'Al Pacino as Tony Montana' },
        { title: 'The Godfather', genre: 'Crime', rating: 9.2, year: 1972, description: 'Francis Ford Coppola classic' },
        { title: 'Scary Movie', genre: 'Comedy', rating: 6.2, year: 2000, description: 'Horror movie parody' },
        { title: 'The Matrix', genre: 'Sci-Fi', rating: 8.7, year: 1999, description: 'Neo discovers the truth about reality' },
        { title: 'Inception', genre: 'Sci-Fi', rating: 8.8, year: 2010, description: 'Dreams within dreams' },
        { title: 'Goodfellas', genre: 'Crime', rating: 8.7, year: 1990, description: 'Martin Scorsese crime epic' },
        { title: 'Casino', genre: 'Crime', rating: 8.2, year: 1995, description: 'Las Vegas crime story' },
        { title: 'The Departed', genre: 'Crime', rating: 8.5, year: 2006, description: 'Undercover cops and mobsters' }
      ];

      for (const movie of movies) {
        await pool.query(
          'INSERT INTO movies (title, genre, rating, year, description) VALUES ($1, $2, $3, $4, $5)',
          [movie.title, movie.genre, movie.rating, movie.year, movie.description]
        );
      }
      console.log('Initial movies inserted');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all movies (protected route)
app.get('/api/movies', keycloak.protect(), async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'title';
    const order = req.query.order || 'ASC';
    const genre = req.query.genre;
    
    let query = 'SELECT * FROM movies';
    let params = [];
    
    if (genre && genre !== 'all') {
      query += ' WHERE genre = $1';
      params.push(genre);
    }
    
    query += ` ORDER BY ${sortBy} ${order}`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get movie by ID (protected route)
app.get('/api/movies/:id', keycloak.protect(), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new movie (protected route)
app.post('/api/movies', keycloak.protect(), async (req, res) => {
  try {
    const { title, genre, rating, year, description } = req.body;
    
    if (!title || !genre) {
      return res.status(400).json({ error: 'Title and genre are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO movies (title, genre, rating, year, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, genre, rating || null, year || null, description || '']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update movie (protected route)
app.put('/api/movies/:id', keycloak.protect(), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, genre, rating, year, description } = req.body;
    
    const result = await pool.query(
      'UPDATE movies SET title = $1, genre = $2, rating = $3, year = $4, description = $5 WHERE id = $6 RETURNING *',
      [title, genre, rating, year, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete movie (protected route)
app.delete('/api/movies/:id', keycloak.protect(), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unique genres (protected route)
app.get('/api/genres', keycloak.protect(), async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT genre FROM movies ORDER BY genre');
    res.json(result.rows.map(row => row.genre));
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, async () => {
  console.log(`Movie Library Backend running on port ${port}`);
  await initDatabase();
});
