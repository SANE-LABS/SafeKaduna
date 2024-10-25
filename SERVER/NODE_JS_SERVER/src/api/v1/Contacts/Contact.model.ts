import { Schema, model } from "mongoose";
interface Emergency {
	email: string;
	phoneNumber: number;
}

let contactSchema = new Schema<Emergency>({
	email: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: Number,
		required: true,
	},
});

const Contact = model("Contact", contactSchema);
export {Emergency}
export default Contact;
