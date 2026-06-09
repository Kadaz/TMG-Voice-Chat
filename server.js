const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

console.log("LAN CHAT SERVER running on ws://localhost:3000");

let users = {};

function broadcast(data) {
  const msg = JSON.stringify(data);

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

wss.on("connection", (ws) => {

  ws.on("message", (raw) => {

    const data = JSON.parse(raw);

    // USER JOIN
    if (data.type === "join") {
      users[data.id] = data.name;
      broadcast({ type: "users", users });
    }

    // CHAT
    if (data.type === "chat") {
      broadcast(data);
    }

    // DISCONNECT
    ws.on("close", () => {
      delete users[data.id];
      broadcast({ type: "users", users });
    });

  });

});