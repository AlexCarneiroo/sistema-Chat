const { SocketAddress } = require("net");
const { userInfo } = require("os");

const app = require("express")();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

let usuarios = [];
let socketIds = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("new user", (data) => {
    if (usuarios.indexOf(data) != -1) {
      socket.emit("new user", { succes: false });
    } else {
      usuarios.push(data);
      socketIds.push(socket.id);
      socket.emit("new user", { success: true });
      socket.broadcast.emit("hello", "world");
    }
  });

  socket.on("chat message", (obj) => {
    io.emit("chat message", obj);
    console.log("teste")
  });

  socket.on("disconnect", () => {
    let id = socketIds.indexOf(socket.id);

    socketIds.splice(id, 1);

    usuarios.splice(id, 1);

    console.log(socketIds);

    console.log(usuarios);

    console.log("user disconnected");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
