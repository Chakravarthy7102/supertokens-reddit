import mongoose from "mongoose";

export interface IPost {
	content: string;
	upvotes: string[];
	downvotes: string[];
}

export type IPostModel = IPost & mongoose.Document;

export const UserSchema = new mongoose.Schema<IPostModel>(
	{
		content: {
			type: String,
		},
		upvotes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
		downvotes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model<IPostModel>("Post", UserSchema);

export default User;
