import { injectable, inject, container, autoInjectable } from "tsyringe";
import AuthRepository from "../Auth/AuthRepository";
import bcrypt from "bcrypt";
import { IUser } from "./User.model";
import { ApplicationError } from "../../../utils/errorHandler";
import HttpStatusCodes from "../../../constants/HttpStatusCodes";
import { RootFilterQuery } from "mongoose";
import { UserRepository } from "./User.repository";
import DuplicateError from "../../../Exceptions/DuplicateError";
@autoInjectable()
class UserService {
	private authRepository: AuthRepository;
	private userRepository: UserRepository;
	constructor(userRepository: UserRepository, authRepository: AuthRepository) {
		this.authRepository = authRepository;
		this.userRepository = userRepository;
	}

	public async register(userDetails: Partial<IUser>): Promise<IUser> {
		const { email, password } = userDetails;
		if (!email || !password)
			throw new ApplicationError("Email and Password required", HttpStatusCodes.UNPROCESSABLE_ENTITY);
		const existingUser = await this.authRepository.findUserByEmail(email);
		if (existingUser) {
			throw new DuplicateError("Email");
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
