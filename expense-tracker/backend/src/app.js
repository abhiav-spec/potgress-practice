import express from 'express';
import userRoutes from './routes/user.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();

app.use(express.json());
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});
app.use('/api/transactions', transactionRoutes);
app.use('/api', userRoutes);
app.use("/categories", categoryRoutes);

export default app;
