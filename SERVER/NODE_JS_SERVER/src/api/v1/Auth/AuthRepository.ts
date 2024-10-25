import HttpStatusCodes from "../../../constants/HttpStatusCodes";
import { ApplicationError } from "../../../utils/errorHandler";
import User, { IUser } from "../User/User.model";
import AuthModel, { IAuthModel } from "./AuthToken.model";

class AuthRepository {
	constructor() {}
	public async findUserByEmail(email: string): Promise<IUser | null> {
		return await User.findOne({ email });
	}
	public async fundUserByUserName(username: string): Promise<IUser | null> {
		return await User.findOne({ username });
	}
	public async saveUser(user: IUser): Promise<IUser> {
		const newUser = new User(user);
		return await newUser.save();
	}

	public async findUserById(id: string): Promise<IUser | null> {
		return await User.findById(id);
	}

	public async findUserByDetails(identifier: string): Promise<IUser | null> {
		return await User.findOne({
			$or: [{ email: identifier }, { _id: identifier }, { username: identifier }],
		});
	}
	public async removeRefreshToken(refreshToken: string): Promise<IUser | null> {
		let user = await User.findOne({ refreshTokens: refreshToken });
		if (!user) throw new ApplicationError("invalid or expired token", HttpStatusCodes.UNPROCESSABLE_ENTITY);
		user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
		return await user.save();
	}
	public async deleteResetToken(token: string): Promise<IAuthModel | null> {
		return await AuthModel.findOneAndDelete({ token });
	}
	public async assignResetToken(userId: Partial<IAuthModel>, token: string): Promise<IAuthModel | null> {
		return await new AuthModel({
			userId,
			token,
		}).save();
	}
	public async findResetTokenByUserId(userId: any): Promise<IAuthModel | null> {
		return await AuthModel.findOne({ userId });
	}
}

export default AuthRepository;
