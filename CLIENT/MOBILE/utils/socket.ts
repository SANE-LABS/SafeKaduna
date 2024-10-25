import { io } from "socket.io-client";
const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL);
export default socket;
