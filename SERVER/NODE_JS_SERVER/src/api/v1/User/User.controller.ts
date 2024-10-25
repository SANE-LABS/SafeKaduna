import { injectable, inject } from "tsyringe";
import UserService from "./User.service";
import { RootFilterQuery } from "mongoose";
import { IUser } from "./User.model";
import { Request, Response } from "express";
@injectable()
export class UserController {
	constructor(@inject(UserService) private userService: UserService) {}

	public async getUserContacts(req: Request, res: Response) {
		const userId: RootFilterQuery<IUser> = req.body;
		return await this.userService.getUserContacts(userId);
	}
}
