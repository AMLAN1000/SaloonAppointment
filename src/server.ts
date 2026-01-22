import { Server } from "http";
import config from "./config";
import app from "./app";

let server: Server;

async function startServer() {
  // Railway provides PORT via environment variable
  const port = process.env.PORT || config.port || 5050;

  server = app.listen(port, () => {
    console.log("✅ Server is listening on port", port);
    console.log("🌍 Environment:", process.env.NODE_ENV || "development");
  });
}

async function main() {
  await startServer();

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  process.on("uncaughtException", (error) => {
    console.log("❌ Uncaught Exception:", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log("❌ Unhandled Rejection:", error);
    exitHandler();
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down gracefully...");
    exitHandler();
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down gracefully...");
    exitHandler();
  });
}

main();
