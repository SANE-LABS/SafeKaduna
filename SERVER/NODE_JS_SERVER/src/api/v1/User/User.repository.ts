import User, { IUser } from "./User.model";
import { Emergency } from "../Contacts/Contact.model";
import { RootFilterQuery } from "mongoose";
export class UserRepository {
	constructor() {}
	public async createUser(userData: { username: string; password: string }): Promise<IUser> {
		const newUser = new User(userData);
		return await newUser.save();
	}

	public async findByUsername(username: string): Promise<IUser | null> {
		return await User.findOne({ username });
	}

	public async findById(userId: string): Promise<IUser | null> {
		return await User.findById(userId);
	}

	public async addRefreshToken(userId: string, refreshToken: string) {
		return await User.findByIdAndUpdate(userId, {
			$push: { refreshTokens: refreshToken },
		});
	}

	public async removeToken(userId: string, accessToken: string) {
		return await User.findByIdAndUpdate(userId, {
			$pull: { tokens: accessToken },
		});
	}
	public async removeRefreshToken(userId: string, refreshToken: string) {
		return await User.findByIdAndUpdate(userId, {
			$pull: { refreshTokens: refreshToken },
		});
	}

	public async replaceRefreshToken(userId: string, oldToken: string, newToken: string) {
		return await User.findOneAndUpdate({ _id: userId, refreshTokens: oldToken }, { $set: { refreshTokens: newToken } });
	}

	public async getUserEmergencyContacts(userId: RootFilterQuery<IUser>) {
		let user = await User.findOne({ _id: userId });
		return user?.emergency_contacts;
	}
	public async addEmergencyContact(contact: Emergency, userId: RootFilterQuery<IUser>) {
		return await User.findOneAndUpdate({ _id: userId }, { $push: { emergency_contacts: contact } });
	}

	public async removeEmergencyContact(contact: Emergency, userId: RootFilterQuery<IUser>) {
		return await User.findOneAndUpdate({ _id: userId }, { $pull: { emergency_contacts: contact } });
	}
}
