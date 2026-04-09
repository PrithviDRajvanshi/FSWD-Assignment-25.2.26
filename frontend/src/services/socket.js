import { io } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL;
const fallbackServerUrl = apiUrl ? apiUrl.replace(/\/api\/?$/, '') : window.location.origin;
const SERVER_URL = import.meta.env.VITE_SERVER_URL || fallbackServerUrl;

// create a singleton socket instance; autoConnect is disabled so user code controls when to connect
// initial auth token (may be null); updated before connect in components
const socket = io(SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: localStorage.getItem('token'),
  },
});

export default socket;
