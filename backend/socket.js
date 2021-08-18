const socket = require("socket.io");

let io;

module.exports = {
    initIO: server => {
        io = socket(server, {
            cors: {
              origin: "http://localhost:3000",
              methods: ["GET", "POST"]
            }
          });
        return io;
    },
    getIO: () => {
        if (!io){
            throw new Error("Websocket is not initialized!");
        }
        return io;
    }
}