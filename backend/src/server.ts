import http from "http";
import {app} from "./app"; 

const PORT = process.env.PORT || 3000;


const server = http.createServer(app);

// Start listening
server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// Handle unexpected errors gracefully
server.on("error", (error: NodeJS.ErrnoException) => {
  console.error("❌ Server error:", error.message);
  process.exit(1);
});
