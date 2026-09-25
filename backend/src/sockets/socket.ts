import { Server } from "socket.io";

let ioInstance: Server | null = null;

export const setupSocket = (io: Server) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join:phc", (phcId: string) => {
      if (typeof phcId === "string") {
        socket.join(`phc:${phcId}`);
      }
    });

    socket.on("leave:phc", (phcId: string) => {
      if (typeof phcId === "string") {
        socket.leave(`phc:${phcId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export const getIO = (): Server | null => {
  return ioInstance;
};

export const emitInventoryUpdated = (data: unknown) => {
  if (ioInstance) {
    ioInstance.emit("inventory:updated", data);
  }
};

export const emitAlertCreated = (data: unknown) => {
  if (ioInstance) {
    ioInstance.emit("alert:created", data);
  }
};

export const emitTransferCreated = (data: unknown) => {
  if (ioInstance) {
    ioInstance.emit("transfer:created", data);
  }
};

export const emitTransferUpdated = (data: unknown) => {
  if (ioInstance) {
    ioInstance.emit("transfer:updated", data);
  }
};

export const emitShipmentUpdated = (data: unknown) => {
  if (ioInstance) {
    ioInstance.emit("shipment:updated", data);
  }
};