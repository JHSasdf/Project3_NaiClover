import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    methods: '*',
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const connectedClients: Record<string, Socket> = {};
const chatRooms: Record<
  string,
  { id: string; name: string; inviteCode: string }
> = {};

io.on('connection', (socket: Socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  connectedClients[socket.id] = socket;

  socket.on('chat message', (msg) => {
    if (msg.text.startsWith('You:')) {
      console.log(`You: ${msg.text}`);
    } else {
      console.log(`Server: ${msg.text}`);
    }

    if (msg.room) {
      const serverMessage = `Server: ${msg.text}`;
      const isSentByMe = msg.isSentByMe || false;

      io.to(msg.room).emit('chat message', {
        ...msg,
        text: serverMessage,
        isSentByMe,
      });

      console.log(serverMessage);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete connectedClients[socket.id];
  });

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  socket.on('createRoom', ({ roomName }) => {
    const roomId = generateUniqueId();
    const inviteCode = generateInviteCode();
    chatRooms[roomId] = { id: roomId, name: roomName, inviteCode };

    socket.emit('roomCreated', { roomId, roomName });
    io.emit('roomCreated', { roomId, roomName });
  });

  socket.on('joinRoomByInviteCode', (inviteCode) => {
    const room = findRoomByInviteCode(inviteCode);

    if (room) {
      socket.join(room.id);
      socket.emit('joinedRoom', room.id);
    } else {
      socket.emit('invalidInviteCode');
    }
  });
});

const generateInviteCode = () => {
  return Math.random().toString(36).substr(2, 8);
};

const findRoomByInviteCode = (inviteCode: string) => {
  return Object.values(chatRooms).find(
    (room) => room.inviteCode === inviteCode
  );
};

app.get('/api/chatRooms', (req: Request, res: Response) => {
  res.json(Object.values(chatRooms));
});

app.get('/api/chatRooms/:roomId', (req: Request, res: Response) => {
  const roomId = req.params.roomId;
  const room = chatRooms[roomId];

  if (room) {
    res.json(room);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
