import statusCodes from "../constants/HttpStatusCodes";
import CustomError from "./customErrors";
export default class NotFound extends CustomError {
	message: string;
	statusCode: number;
	errors?: [any] | undefined;
	constructor(message: string) {
		super();
		this.message = message;
		this.statusCode = statusCodes.NOT_FOUND;
	}
}

