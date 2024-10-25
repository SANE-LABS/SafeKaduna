import "reflect-metadata";
import app from "./app";
import config from "../config/config";
import { mongodb } from "../config/MongoConnection";
const { port } = config;
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer(app);
const io = new Server(server);

io.on("connection", socket => {
	console.log("A user connected");

	socket.on("audioChunk", chunk => {
		console.log('chunk recieved');
	});
	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

async function startServer() {
	try {
		await mongodb.connect();
		server.listen(port, () => {
			console.log(`${config.NODE_ENV} Server is running on port ${port}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}

	process.on("SIGINT", async () => {
		console.log("Shutting down server...");
		await mongodb.disconnect();
		server.close(() => {
			console.log("HTTP server closed");
			process.exit(0);
		});
	});
}

(async () => {
	await startServer();
})();
