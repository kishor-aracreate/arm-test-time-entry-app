import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "timer_app",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create the connection pool
export const pool = new Pool(poolConfig);

// Handle pool errors
pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log("✅ Database pool closed");
  } catch (error) {
    console.error("❌ Error closing database pool:", error);
  }
};
