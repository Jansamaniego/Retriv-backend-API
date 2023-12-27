import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(8000),
    SERVER_URL: Joi.string().default('http://localhost:8000'),
    CLIENT_URL: Joi.string().default('http://localhost:3000'),
    DATABASE_CONNECTION: Joi.string().required().description('MongoDB URL'),
    DATABASE_PASSWORD: Joi.string().required().description('MongoDB Password'),
    JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('Minutes After Which Access Tokens Expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('Days After Which Refresh Tokens Expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('Minutes After Which Reset Password Token Expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('Minutes After Which Verify Email Token Expires'),
    COOKIE_ACCESS_EXPIRATION_DAYS: Joi.number()
      .default(1)
      .description('Days after which the access token cookie expires'),
    COOKIE_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(10)
      .description('Days after which the refresh token cookie expires'),
    CLIENT_EMAIL: Joi.string().description('Gmail Client Email'),
    CLIENT_ID: Joi.string().description('Gmail Client ID'),
    CLIENT_SECRET: Joi.string().description('Gmail Client Secret'),
    REDIRECT_URI: Joi.string().description('Gmail Redirect URI'),
    GOOGLE_OAUTH_CLIENT_ID: Joi.string().description('Google OAuth Client Id'),
    GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().description('Google OAuth Secret'),
    GOOGLE_OAUTH_REDIRECT_URI: Joi.string().description(
      'Google Oauth Redirect Path'
    ),
    REFRESH_TOKEN: Joi.string().description('Gmail Refresh Token'),
    CLOUD_NAME: Joi.string().description('Cloudinary Storage Name'),
    CLOUD_API_KEY: Joi.string().description('Cloudinary Api Key'),
    CLOUD_API_SECRET: Joi.string().description('Cloudinary Api Secret'),
    CLOUD_PROJECT: Joi.string().description('Project Folder'),
    STRIPE_SECRET_KEY: Joi.string().description('Stripe Secret Key')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({
    errors: { label: 'key' }
  })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  server: {
    url: envVars.SERVER_URL,
    port: envVars.PORT
  },
  client: {
    url: envVars.CLIENT_URL
  },
  db: {
    url: envVars.DATABASE_CONNECTION,
    password: envVars.DATABASE_PASSWORD
  },
  cookie: {
    accessCookieExpirationDays: envVars.COOKIE_ACCESS_EXPIRATION_DAYS,
    refreshCookieExpirationDays: envVars.COOKIE_REFRESH_EXPIRATION_DAYS
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  email: {
    from: envVars.CLIENT_EMAIL,
    client: {
      id: envVars.CLIENT_ID,
      secret: envVars.CLIENT_SECRET
    },
    RedirectUri: envVars.REDIRECT_URI,
    RefreshToken: envVars.REFRESH_TOKEN
  },
  googleOAuth: {
    client: {
      id: envVars.GOOGLE_OAUTH_CLIENT_ID,
      secret: envVars.GOOGLE_OAUTH_CLIENT_SECRET
    },
    redirectUri: envVars.GOOGLE_OAUTH_REDIRECT_URI
  },
  cloud: {
    name: envVars.CLOUD_NAME,
    api_key: envVars.CLOUD_API_KEY,
    api_secret: envVars.CLOUD_API_SECRET,
    project: envVars.CLOUD_PROJECT
  },
  stripe: {
    secret_key: envVars.STRIPE_SECRET_KEY
  }
};

export default config;
