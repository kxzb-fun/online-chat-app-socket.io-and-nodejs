const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 静态资源服务
app.use(express.static("public"));

// 监听用户连接
io.on("connection", (socket) => {
  console.log("用户已连接", socket.id);

  // 广播新用户加入
  socket.broadcast.emit("user_connected", "新用户加入聊天室");

  // 接收消息并广播
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // 用户断开连接
  socket.on("disconnect", () => {
    console.log("用户断开连接", socket.id);
    io.emit("user_disconnected", "用户离开聊天室");
  });
});

// 监听端口
const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
});
