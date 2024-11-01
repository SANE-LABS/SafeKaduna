import statusCodes from "../constants/HttpStatusCodes";
import CustomError from "./customErrors";
export default class DuplicateError extends CustomError {
	message: string;
	statusCode: number;
	errors?: [any] | undefined;
	constructor(message: string) {
		super();
		this.message = `${message} already exists`;
		this.statusCode = statusCodes.BAD_REQUEST;
	}
}
