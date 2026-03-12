import { io } from 'socket.io-client';

// You can adjust this to use an environment variable if desired
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

// create a singleton socket instance; autoConnect is disabled so user code controls when to connect
const socket = io(SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
