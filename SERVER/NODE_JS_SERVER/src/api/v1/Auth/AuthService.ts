import bcrypt from "bcrypt";
import JwtHelper from "../../../utils/JWTHelper";
import { UserRepository } from "../User/User.repository";
import { ApplicationError } from "../../../utils/errorHandler";
import HttpStatusCodes from "../../../constants/HttpStatusCodes";
import { autoInjectable } from "tsyringe";
import AuthRepository from "./AuthRepository";
import Mail from "../../../utils/emailUtils";
import config from "../../../../config/config";
import Helper from "../../../utils/Helper";
const { SuccessResponse } = Helper;
@autoInjectable()
export default class AuthService {
	private userRepository: UserRepository;
	private authRepository: AuthRepository;
	private jwtHelper: JwtHelper;

	constructor(userRepository: UserRepository, jwtHelper: JwtHelper, authRepository: AuthRepository) {
		this.userRepository = userRepository;
		this.jwtHelper = jwtHelper;
		this.authRepository = authRepository;
	}

	public async registerUser(username: string, password: string) {
		const hashedPassword = await bcrypt.hash(password, 10);
		const usernameExists = !!(await this.userRepository.findByUsername(username));
		if (usernameExists) throw new ApplicationError("user already exists", HttpStatusCodes.BAD_REQUEST);
		const newUser = await this.userRepository.createUser({
			username,
			password: hashedPassword,
		});
		return newUser;
	}

	public async loginUser(identifier: string, password: string) {
		const user = await this.authRepository.findUserByDetails(identifier);
		if (!user) throw new ApplicationError("User not found", HttpStatusCodes.NOT_FOUND);
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) throw new ApplicationError("Invalid password", HttpStatusCodes.NOT_FOUND);

		const accessToken = this.jwtHelper.generateAccessToken(user._id as string);
		const refreshToken = this.jwtHelper.generateRefreshToken(user._id as string);

		await this.userRepository.addRefreshToken(user._id as string, refreshToken);

		return { accessToken, refreshToken, user };
	}

	public async refreshAccessToken(refreshToken: string) {
		const decoded = this.jwtHelper.verifyRefreshToken(refreshToken);

		const user = await this.userRepository.findById(decoded.userId);
		if (!user || !user.refreshTokens.includes(refreshToken)) {
			throw new Error("Invalid Refresh Token");
		}

		const newAccessToken = this.jwtHelper.generateAccessToken(user._id as string);

		const newRefreshToken = this.jwtHelper.generateRefreshToken(user._id as string);
		await this.userRepository.replaceRefreshToken(user._id as string, refreshToken, newRefreshToken);

		return { newAccessToken, newRefreshToken };
	}

	public async logoutUser(userId: string, token: string, refreshToken: string) {
		await this.userRepository.removeToken(userId, token);
		await this.userRepository.removeRefreshToken(userId, refreshToken);
	}
	public async forgotPasswordRequest(email: string) {
		let token: string;
		let subject = "Password Reset Request";

		let user = await this.authRepository.findUserByEmail(email);
		if (!user) throw new ApplicationError("mail not found", HttpStatusCodes.BAD_REQUEST);
		await this.authRepository.findResetTokenByUserId(user._id);
		token = this.jwtHelper.generateAccessToken(email);

		const resetUrl = `${config.email.url}/reset-password/${user._id?.toString()}/${token}`;
		const templateData = {
			name: user.username,
			resetCode: token,
			resetUrl,
		};
		await Mail.sendHtmlEmail(email, subject, "ResetPassword", templateData);

		return;
	}
	public async ResetPassword(token: string) {
		let decoded = await this.jwtHelper.verifyAccessToken(token);
		console.log(decoded);
		return decoded;
	}
}
