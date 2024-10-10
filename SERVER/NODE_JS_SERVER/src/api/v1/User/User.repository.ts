import User, { IUser } from "./User.model";

export class UserRepository {
	private static instance: UserRepository;

	private constructor() {}

	static getInstance(): UserRepository {
		if (!UserRepository.instance) {
			UserRepository.instance = new UserRepository();
		}
		return UserRepository.instance;
	}

	async createUser(userData: { username: string; password: string }): Promise<IUser> {
		const newUser = new User(userData);
		return await newUser.save();
	}

	async findByUsername(username: string): Promise<IUser | null> {
		return await User.findOne({ username });
	}

	async findById(userId: string): Promise<IUser | null> {
		return await User.findById(userId);
	}

	async addRefreshToken(userId: string, refreshToken: string) {
		return await User.findByIdAndUpdate(userId, {
			$push: { refreshTokens: refreshToken },
		});
	}

	async removeToken(userId: string, accessToken: string) {
		return await User.findByIdAndUpdate(userId, {
			$pull: { tokens: accessToken },
		});
	}
	async removeRefreshToken(userId: string, refreshToken: string) {
		return await User.findByIdAndUpdate(userId, {
			$pull: { refreshTokens: refreshToken },
		});
	}

	async replaceRefreshToken(userId: string, oldToken: string, newToken: string) {
		return await User.findOneAndUpdate(
			{ _id: userId, refreshTokens: oldToken },
			{ $set: { "refreshTokens.$": newToken } }
		);
	}
}
