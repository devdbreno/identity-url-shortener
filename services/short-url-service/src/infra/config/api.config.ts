import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
  PORT_SHORT_URL: parseInt(process.env.PORT_URL_SHORTENER, 10) || 4001,
  HOST_IDENTITY_TCP: process.env.HOST_IDENTITY_TCP || 'localhost',
  PORT_IDENTITY_TCP: parseInt(process.env.PORT_IDENTITY_TCP, 10) || 4002,
}));
