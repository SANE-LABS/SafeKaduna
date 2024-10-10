// import "reflect-metadata";
// import app from "./app";
// import config from "../config/config";
// const { port } = config;
// import { mongodb } from "../config/MongoConnection";
// (async () => {
// 	await mongodb.connect();

// 	app.listen(port, () => {
// 		console.log(`${config.NODE_ENV} Server is running on port ${port}`);
// 	});
// })();

import "reflect-metadata";
import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import axios from "axios";
import config from "../config/config";
import { mongodb } from "../config/MongoConnection";
import app from "./app";
const server = createServer(app);
const io = new SocketServer(server);

const { port } = config;
const FLASK_SERVER_URL = "http://your-flask-server-url";
const BATCH_DURATION = 10000; // 10 seconds

interface AudioData {
	buffer: Buffer;
	timestamp: number;
}

let audioBuffer: AudioData[] = [];
let lastSendTime = Date.now();

io.on("connection", socket => {
	console.log("Client connected");

	socket.on("audioData", (data: Buffer) => {
		audioBuffer.push({ buffer: data, timestamp: Date.now() });
		if (Date.now() - lastSendTime >= BATCH_DURATION) {
			sendAudioBatch();
		}
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

async function sendAudioBatch() {
	if (audioBuffer.length > 0) {
		const batchData = Buffer.concat(audioBuffer.map(item => item.buffer));

		try {
			await axios.post(`${FLASK_SERVER_URL}/process_audio`, batchData, {
				headers: {
					"Content-Type": "application/octet-stream",
				},
			});
			console.log("Audio batch sent successfully");
		} catch (error) {
			console.error("Error sending audio batch:", error);
		}

		audioBuffer = [];
		lastSendTime = Date.now();
	}
}

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
}

(async () => {
	await startServer();
})();
