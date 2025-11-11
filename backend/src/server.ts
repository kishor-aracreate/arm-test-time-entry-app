import http from "http";
import { app } from "./app";
import { config, closePool } from "./config";

const PORT = config.port;

const server = http.createServer(app);

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Start listening
    server.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      if (config.nodeEnv !== "production") {
        console.log(
          `⚠️  Note: Some features may not work without database connection`
        );
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unexpected errors gracefully
server.on("error", (error: NodeJS.ErrnoException) => {
  console.error("❌ Server error:", error.message);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 SIGTERM received, shutting down gracefully...");
  server.close(async () => {
    await closePool();
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("🔄 SIGINT received, shutting down gracefully...");
  server.close(async () => {
    await closePool();
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// Start the server
startServer();
