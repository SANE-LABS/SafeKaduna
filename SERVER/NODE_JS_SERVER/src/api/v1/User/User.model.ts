import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { Roles } from "../../../constants/enum";
import Helper from "../../../utils/Helper";
interface IUser extends Document {
	firstName: string;
	lastName: string;
	otherNames: string;
	userId: string;
	username: string;
	email: string;
	id: string;
	role: Roles;
	password: string;
	organization: string;
	orgId: string;
	isActive: boolean;
	refreshTokens: string[];
	// verifiedPassword: any;
}
type IUserDocument = IUser & Document;
const userSchema = new Schema<IUser>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		otherNames: String,
		username: String,
		email: String,
		userId: String,
		id: String,
		role: { type: String, enum: Object.values(Roles) },
		password: String,
		organization: String,
		orgId: String,
		isActive: { type: Boolean, required: true, default: true },
		refreshTokens: { type: [String] },
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	this.username = await Helper.generateUsername(this.firstName, this.lastName, this.organization);
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
export { IUserDocument, IUser };
export default User;
