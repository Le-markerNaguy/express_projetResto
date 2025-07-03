// Import dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

// Middleware global pour forcer les headers CORS sur toutes les routes (y compris /socket.io/*)
app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "https://projet-resto-frontend.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('hello world');
});

// Register API routes
console.log('Type commandeRoute:', typeof commandeRoute);
console.log('Type adminRoute:', typeof adminRoute);
console.log('Type platRoute:', typeof platRoute);
console.log('Type tableRoute:', typeof tableRoute);
app.use('/api/commandes', commandeRoute);
app.use('/api/admin', adminRoute);
app.use('/api/plats', platRoute);
app.use('/api/tables', tableRoute);

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://projet-resto-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

io.on("connection", (socket) => {
  console.log("Admin connecté en WebSocket");
});

// Start the server
const PORT=process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));