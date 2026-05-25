// --- Standalone production Node.js + Mongo + Socket.io Server ---
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// MONGODB SCHEMA DEFINITION
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  balance: { type: Number, default: 5000 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 }
});
const UserModel = mongoose.model('User', UserSchema);

io.on('connection', (socket) => {
  socket.on('auth:init', async (username) => {
    let user = await UserModel.findOne({ username });
    if (!user) {
      user = await UserModel.create({ username });
    }
    socket.join(user.id);
  });

  socket.on('queue:join', ({ userId, wager }) => {
    // Ajout à la queue Redis et calcul du matchmaking 10x10 alterné
  });
});

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/dames_mali")
  .then(() => {
    server.listen(3000, () => console.log('Server started on port 3000'));
  });
