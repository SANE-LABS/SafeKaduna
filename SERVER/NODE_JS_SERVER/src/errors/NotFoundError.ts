import statusCodes from "../constants/HttpStatusCodes";
export default class NotFound extends Error {
	message: string;
	statusCode: number;
	constructor(message: string) {
		super(message);
		this.message = message;
		this.statusCode = statusCodes.NOT_FOUND;
	}
}
