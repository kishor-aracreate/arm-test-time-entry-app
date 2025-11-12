import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const config = {
  coreBackend: process.env.CORE_BACKEND,
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    name: process.env.DB_NAME || "timer_app",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  nodeEnv: process.env.NODE_ENV || "development",
};

// Export database utilities
export { pool, closePool } from "./database";
export { initializeDatabase } from "./init-db";
