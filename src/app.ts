// Import dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import commandeRoute from './routes/commandeRoute';
import adminRoute from './routes/adminRoute';
import platRoute from './routes/platRoute';
import tableRoute from './routes/tableRoute';

// Initialize dotenv
dotenv.config();

// Create an Express application
const app = express();

// CORS configuration: Allow React frontends to access the API
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001' ,'https://projet-resto-frontend.vercel.app'], // Frontend addresses
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // Allow cookies/authentication
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('hello world');
});

// Register API routes
app.use('/api/commandes', commandeRoute);
app.use('/api/admin', adminRoute);
app.use('/api/plats', platRoute);
app.use('/api/tables', tableRoute);

// Start the server
const PORT=process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));