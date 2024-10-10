// src/services/UserService.ts
import { injectable, inject } from "tsyringe";
import AuthRepository from "../Auth/AuthRepository";
import bcrypt from "bcrypt";
import { IUser } from "./User.model";
import { ApplicationError } from "../../../utils/errorHandler";
import HttpStatusCodes from "../../../constants/HttpStatusCodes";

@injectable()
class UserService {
	constructor(
		@inject(AuthRepository) private authRepository: AuthRepository // Inject the AuthRepository
	) {}

	async register(userDetails: Partial<IUser>): Promise<IUser> {
		const { email, password } = userDetails;
		if (!email || !password)
			throw new ApplicationError(
				"Email and Password required",
				HttpStatusCodes.UNPROCESSABLE_ENTITY
			);
		const existingUser = await this.authRepository.findUserByEmail(email);
		if (existingUser) {
			throw new Error("User with this email already exists");
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = { ...userDetails, password: hashedPassword } as IUser;
		return this.authRepository.saveUser(newUser);
	}
}

export default UserService;
