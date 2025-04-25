import { registerAs } from "@nestjs/config";

export default registerAs("identity_db", () => ({
  host: process.env.DB_IDENTITY_HOST as string,
  port: parseInt(process.env.DB_IDENTITY_PORT, 10),
  name: process.env.DB_IDENTITY_NAME as string,
  user: process.env.DB_IDENTITY_USER as string,
  password: process.env.DB_IDENTITY_PASSWORD as string,
}));
