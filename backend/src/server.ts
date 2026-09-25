import app from "./app";
import { prisma } from "./config/database";
import { redis } from "./config/redis";
import "./jobs/worker";

import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocket } from "./sockets/socket";

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

setupSocket(io);

httpServer.listen(PORT, async () => {
  await prisma.$connect();

  console.log(`Server running on port ${PORT}`);
  console.log("Database connected");

  await redis.ping();

  console.log("Redis connected");
});