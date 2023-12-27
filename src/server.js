import app from './app';
import logger from './config/logger';
import connectDB from './config/db';
import config from './config/config';
import { Product } from './models';
import { faker } from '@faker-js/faker';

const cosmeticsProducts = [...Array(30)].map((_, idx) => {
  return {
    name: faker.commerce.productName(),
    price: faker.commerce.price({
      min: 1,
      max: 8000,
      dec: 0
    }),
    mainImage: faker.image.urlLoremFlickr({
      category: 'utensils',
      width: 600
    }),
    imaging: [...Array(3)].map((_, idx) => {
      return faker.image.urlLoremFlickr({ category: 'utensils', width: 600 });
    }),
    description: faker.commerce.productDescription(),
    category: '64802bfe0fd55d1eee86ba5e',
    shop: '65886593bc9bfd0a4f36378d',
    shopOwner: '65886558bc9bfd0a4f36377a',
    quantityInStock: 50
  };
});

// Connect to MongoDB
connectDB();
// .then((db) => Product.insertMany(cosmeticsProducts))
// .catch((err) => {
//   console.log(err);
// });

const serverPort = config.server.port;

const server = app.listen(serverPort, () => {
  logger.info(`
      ################################################
      🚀 Server listening on port: ${serverPort} 🚀
      ################################################
  `);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
