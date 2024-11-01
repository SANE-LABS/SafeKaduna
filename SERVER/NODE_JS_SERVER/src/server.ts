import "reflect-metadata";
import app from "./app";
import config from "../config/config";
import { mongodb } from "../config/MongoConnection";
const { port } = config;
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import player from "play-sound";

// Create an HTTP server and Socket.IO server
const server = createServer(app);
const io = new Server(server);

// Directory for storing audio chunks
const AUDIO_FOLDER = path.join(__dirname, "audio_chunks");

// Ensure the audio directory exists
if (!fs.existsSync(AUDIO_FOLDER)) {
	fs.mkdirSync(AUDIO_FOLDER);
}

io.on("connection", socket => {
	console.log("A user connected");

	socket.on("audioChunk", async data => {
		try {
			const { chunk } = data;
			console.log("Received audio chunk");

			// Decode the Base64 audio data and save it as a .wav file
			const buffer = Buffer.from(chunk, "base64");
			const filePath = path.join(AUDIO_FOLDER, `chunk_${Date.now()}.wav`);
			fs.writeFileSync(filePath, buffer);
			console.log(`Audio chunk saved at ${filePath}`);

			// Play the audio file
			player().play(filePath, err => {
				if (err) console.error("Error playing audio file:", err);
				else console.log("Playing audio chunk");
			});
		} catch (error) {
			console.error("Error processing audio chunk:", error);
		}
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

// Start the server
(async () => {
	await startServer();
})();
