import { registerAs } from '@nestjs/config';

export default registerAs('identity_db', () => ({
  host: process.env.DB_IDENTITY_HOST,
  port: parseInt(process.env.DB_IDENTITY_PORT, 10),
  name: process.env.DB_IDENTITY_NAME,
  user: process.env.DB_IDENTITY_USER,
  password: process.env.DB_IDENTITY_PASSWORD,
}));
