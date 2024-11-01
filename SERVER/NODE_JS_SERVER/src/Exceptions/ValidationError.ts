import { ValidationError } from "express-validator";
import statusCodes from "../constants/HttpStatusCodes";
import CustomError from "./customErrors";
export default class RequestValidationError extends CustomError {
	message: string;
	statusCode: number;
	errors: any[];
	constructor(errors: ValidationError[]) {
		super();
		this.errors = errors;
		this.message = "validation failed";
		this.statusCode = statusCodes.UNPROCESSABLE_ENTITY;
	}
}
