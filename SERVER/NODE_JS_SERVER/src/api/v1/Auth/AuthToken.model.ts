import { Schema } from "express-validator";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

interface IAuthModel {
	userId: mongoose.Schema.Types.ObjectId;
	token: string;
}
let authSchema = new Schema<IAuthModel>({
	userId: { type: Schema.Types.ObjectId, required: true },
	token: { type: String, required: true },
});
const AuthModel = model("AuthModel", authSchema);

export { IAuthModel };
export default AuthModel;
