import express from 'express';
import 'express-async-errors';
import urlRoutes from './routes/urlRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { appEndpoints } from './constant/endpoint';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', message: 'The server is healthy.' });
});

app.use('/api', urlRoutes);

// Handle Not Found routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist.',
    appEndpoints
  });
});

app.use(errorHandler);

export default app;
