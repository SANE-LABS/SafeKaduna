import { injectable, inject } from "tsyringe";
import AuthRepository from "../Auth/AuthRepository";
import bcrypt from "bcrypt";
import { IUser } from "./User.model";
import { ApplicationError } from "../../../utils/errorHandler";
import HttpStatusCodes from "../../../constants/HttpStatusCodes";
import { RootFilterQuery } from "mongoose";
import { UserRepository } from "./User.repository";
import val from 'express-validator'
@injectable()
class UserService {
	constructor(
		@inject(AuthRepository)
		@inject(UserRepository)
		private authRepository: AuthRepository,
		private userRepository: UserRepository
	) {}

	public async register(userDetails: Partial<IUser>): Promise<IUser> {
		const { email, password } = userDetails;
		if (!email || !password)
			throw new ApplicationError("Email and Password required", HttpStatusCodes.UNPROCESSABLE_ENTITY);
		const existingUser = await this.authRepository.findUserByEmail(email);
		if (existingUser) {
			throw new ApplicationError("User with this email already exists", HttpStatusCodes.BAD_REQUEST);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = { ...userDetails, password: hashedPassword } as IUser;
		return this.authRepository.saveUser(newUser);
	}
	public async getUserContacts(userId: RootFilterQuery<IUser>) {
		console.log(await this.userRepository.getUserEmergencyContacts(userId));
		return await this.userRepository.getUserEmergencyContacts(userId);
	}
}

export default UserService;
