import mongoose from "mongoose";
import { mongodb } from "../config/MongoConnection";
import UserModel from "./api/v1/User/User.model";

beforeAll(async () => {
	await mongodb.connect();
	await UserModel.deleteMany({});
});
afterAll(async () => {
	//UserModel.collection.drop();
	await mongodb.disconnect();
});
