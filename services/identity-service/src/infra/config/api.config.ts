import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
  PORT_IDENTITY: parseInt(process.env.PORT_IDENTITY, 10) || 4000,
  PORT_IDENTITY_TCP: parseInt(process.env.PORT_IDENTITY_TCP, 10) || 4002,
}));
