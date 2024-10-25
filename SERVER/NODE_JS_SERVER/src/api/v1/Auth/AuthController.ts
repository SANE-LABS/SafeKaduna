import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import AuthService from "./AuthService";
import UserService from "../User/User.service";
import HttpStatusCodes from "../../../constants/HttpStatusCodes";
import { ApplicationError } from "../../../utils/errorHandler";
import Helper from "../../../utils/Helper";
import RequestValidationError from "../../../errors/ReqestValidationError";
const { SuccessResponse } = Helper;

@autoInjectable()
class AuthController {
	private userService: UserService;
	private authService: AuthService;

	constructor(userService: UserService, authService: AuthService) {
		this.userService = userService;
		this.authService = authService;
	}

	public async register(req: Request, res: Response): Promise<Response> {
		const newUser = await this.userService.register(req.body);
		return res.status(HttpStatusCodes.CREATED).json(SuccessResponse("User successfully registered", newUser));
	}

	public async login(req: Request, res: Response): Promise<Response> {
		const { identifier, password } = req.body;
		let { accessToken, refreshToken, user } = await this.authService.loginUser(identifier, password);
		if (!user) throw new ApplicationError("User not Found", HttpStatusCodes.NOT_FOUND);
		return res.status(HttpStatusCodes.OK).json(
			SuccessResponse("successful login", {
				name: user.firstName + user.lastName,
				tokens: {
					accessToken,
					refreshToken,
				},
			})
		);
	}

	public async logout(req: Request, res: Response): Promise<Response> {
		const token = req.headers.authorization?.split(" ")[1];
		const refreshToken = req.headers["refesh"];
		if (!token) throw new ApplicationError("no token provided", HttpStatusCodes.UNAUTHORIZED);
		if (typeof refreshToken !== "string")
			throw new ApplicationError("Refesh token not found", HttpStatusCodes.BAD_REQUEST);
		await this.authService.logoutUser(req.user._id, token, refreshToken);
		return res.sendStatus(HttpStatusCodes.NO_CONTENT);
	}

	public async forgotPasswordRequest(req: Request, res: Response): Promise<Response> {
		const email = req.body.email;
		if (!email) throw new RequestValidationError("email is required");

		await this.authService.forgotPasswordRequest(email);
		return res.status(HttpStatusCodes.OK).json(SuccessResponse("mail sent successfully", ""));
	}

	public async forgotPasswordReset(req: Request, res: Response): Promise<Response> {
		const { token } = req.params;
		if (!token) throw new RequestValidationError("token is required");
		let resetResponse = await this.authService.ResetPassword(token);
		return res.status(HttpStatusCodes.OK).json(resetResponse);
	}
}

export default AuthController;
