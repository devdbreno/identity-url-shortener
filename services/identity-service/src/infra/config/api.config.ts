import { registerAs } from "@nestjs/config";

export default registerAs("api", () => ({
  PORT_IDENTITY: process.env.PORT_IDENTITY || 4000,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiration: process.env.JWT_EXPIRATION || "1h",
}));
