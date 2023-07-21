import mongoose from "mongoose";

export interface IUser {
	username: string;
	avatar: string;
}

export type IUserModel = IUser & mongoose.Document;

export const UserSchema = new mongoose.Schema<IUserModel>(
	{
		username: {
			type: String,
		},
		avatar: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model<IUserModel>("User", UserSchema);

export default User;
