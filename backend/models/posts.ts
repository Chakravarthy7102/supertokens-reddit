import mongoose from "mongoose";
import { IUser } from "./user";

export interface IPost {
	title: string;
	content: string;
	user: IUser;
}

export type IPostModel = IPost & mongoose.Document;

export const PostSchema = new mongoose.Schema<IPostModel>(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model<IPostModel>("Post", PostSchema);

export default Post;
