import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
  PORT_URL_SHORTENER: process.env.PORT_URL_SHORTENER || 4001,
}));
