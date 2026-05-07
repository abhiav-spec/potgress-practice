import express from 'express';
import userRoutes from './routes/user.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;
