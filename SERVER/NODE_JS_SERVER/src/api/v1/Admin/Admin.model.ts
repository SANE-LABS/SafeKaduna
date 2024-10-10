import mongoose from "mongoose";
interface IAdmin {
	userId: String;
	firstName: String;
	lastName: String;
	isPrimary: Boolean;
}
const AdminSchema = new mongoose.Schema({
	userId: String,
	firstName: String,
	lastName: String,
	isPrimary: { type: Boolean, default: false },
});
