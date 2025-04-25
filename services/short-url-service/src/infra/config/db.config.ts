import { registerAs } from '@nestjs/config';

export default registerAs('url_shortener_db', () => ({
  host: process.env.DB_URL_SHORTENER_HOST,
  port: parseInt(process.env.DB_URL_SHORTENER_PORT, 10),
  name: process.env.DB_URL_SHORTENER_NAME,
  user: process.env.DB_URL_SHORTENER_USER,
  password: process.env.DB_URL_SHORTENER_PASSWORD,
}));
