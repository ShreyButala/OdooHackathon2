import app from './app';
import { config } from './config';
import { prisma } from './database';

const startServer = async () => {
  try {
    // Check database connection
    try {
      await prisma.$connect();
      console.log('Successfully connected to the database.');
    } catch (dbError) {
      console.warn('Failed to connect to the database, but starting server anyway:', dbError);
    }

    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
