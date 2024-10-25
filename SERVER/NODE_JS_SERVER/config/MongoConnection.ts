import config from "./config";
import mongoose from "mongoose";
class Database {
	static instance: Database | null = null;

	constructor() {
		if (Database.instance) {
			return Database.instance;
		}
		//this.connect();
		Database.instance = this;
	}

	async connect() {
		try {
			await mongoose.connect(config.db.mongo_uri);
			console.log(`${config.NODE_ENV} database connected`);
		} catch (error:any) {
			console.error("Error connecting to MongoDB:", error.message);
			console.error("Stack trace:", error.stack);
		}
	}
	async disconnect() {
		try {
			await mongoose.disconnect();
			console.log(`${config.NODE_ENV} database disconnected`);
		} catch (error: any) {
			console.error("Error disconnecting from MongoDB:", error.message);
			console.error("Stack trace:", error.stack);
		}
	}
}

const mongodb = new Database();
export { mongodb };
