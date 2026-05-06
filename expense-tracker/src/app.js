import express from 'express';
import  userRoutes from './routes/user.routes.js';

// Middleware
app.use(express.json());

// Routes
app.use("/api", userRoutes);

const app = express();

export default app;
