import mongoose, { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import Helper from "../../../utils/Helper";
import Contact from "../Contacts/Contact.model";

import { Emergency } from "../Contacts/Contact.model";
interface IUser extends mongoose.Document {
	firstName: string;
	lastName: string;
	email: string;
	otherNames: string;
	username: string;
	password: string;
	address: string;
	emergency_contacts: Emergency[];
	isActive: boolean;
	refreshTokens: string[];
	// verifiedPassword: any;
}
// type IUserDocument = IUser & Document;

const userSchema = new Schema<IUser>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		otherNames: String,
		username: String,
		password: String,
		address: String,
		emergency_contacts: [typeof Contact],
		isActive: { type: Boolean, required: true, default: true },
		refreshTokens: { type: [String] },
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	let address = this.address.split(" ")[this.address.split(" ").length - 2];
	this.username = await Helper.generateUsername(this.firstName, this.lastName, address);
});
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});
userSchema.methods.verifiedPassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password);
};

let User = model("User", userSchema);
User.syncIndexes();
export { IUser };
export default User;
