import { io } from "socket.io-client";
console.log(process.env.EXPO_PUBLIC_SOCKET_URL)
const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL);
export default socket;
