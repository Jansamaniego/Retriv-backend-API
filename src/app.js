// Packages
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import createLocaleMiddleware from 'express-locale';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Configs
import config from './config/config';
import { successHandle, errorHandle } from './config/morgan';

// Utils
import errorHandler from './utils/errorHandler';
import AppError from './utils/appError';

// Routes
import routes from './routes';

require('./utils/googleOAuth');

const app = express();

// Morgan Handler
app.use(successHandle);
app.use(errorHandle);

// Set security HTTP headers
app.use(helmet());

// Set Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against XSS
app.use(xss());

// MongoDB data sanitization
app.use(mongoSanitize());

// Implement CORS
app.use(cookieParser());
app.use(cors({ credentials: true, origin: config.client.url }));

// Compress a compresssible response body
app.use(compression());

// Limit Repeated Failed Requests to Auth Endpoints
if (config.env === 'production') {
  app.use('/api', limiter);
}

app.use('/api', routes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
