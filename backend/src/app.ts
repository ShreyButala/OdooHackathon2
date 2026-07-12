import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// API Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

export default app;
