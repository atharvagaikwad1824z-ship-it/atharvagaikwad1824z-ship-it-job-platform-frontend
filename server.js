const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();


const app = express();
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");


// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);
// Create HTTP Server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.conversationId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Error:", error);
  }
};

startServer();