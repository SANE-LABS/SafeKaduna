import { container, autoInjectable } from "tsyringe";
import UserService from "./User.service";
import { RootFilterQuery } from "mongoose";
import { IUser } from "./User.model";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import ValidationError from "./../../../Exceptions/ValidationError";
import HttpStatusCodes from "../../../constants/HttpStatusCodes";
import Helper from "../../../utils/Helper";
const { SuccessResponse } = Helper;
@autoInjectable()
export default class UserController {
	private userService: UserService;
	constructor(userService: UserService) {
		container.resolve(UserService);
		this.userService = userService;
		this.getUserContacts = this.getUserContacts.bind(this);
		this.register = this.register.bind(this);
	}
	public async register(req: Request, res: Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) throw new ValidationError(errors.array());
		let user = await this.userService.register(req.body);
		return res.status(HttpStatusCodes.CREATED).json(SuccessResponse("user registered successfully", user));
	}
	public async getUserContacts(req: Request, res: Response) {
		const userId: RootFilterQuery<IUser> = req.body;
		return await this.userService.getUserContacts(userId);
	}
}
