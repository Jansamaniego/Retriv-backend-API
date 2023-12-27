import mongoose from 'mongoose';
import config from './config';
import logger from './logger';
import { faker } from '@faker-js/faker';

const connectDB = async () => {
  const DB = config.db.url.replace('<password>', config.db.password);

  const con = await mongoose.connect(DB);

  logger.info(`MongoDB Connected: ${con.connection.host}`);

  mongoose.connection.on('connecting', () => {
    logger.info('Connecting to Database');
  });

  mongoose.connection.on('connected', () => {
    logger.info('Mongoose Connected to the Database');
  });

  mongoose.connection.on('error', (error) => {
    logger.error(error.message);
  });

  mongoose.connection.on('disconnected', () => {
    logger.info('Mongoose Disconnected to the Database');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

export default connectDB;
