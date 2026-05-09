import express from 'express';
import paymentRoutes from './routes/payment.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;
