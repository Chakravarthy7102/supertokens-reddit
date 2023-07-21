import mongoose from "mongoose";
import { IPost } from "./posts";
import { IUser } from "./user";

export interface IVote {
	postId: IPost;
	userId: IUser;
	isUpVote: boolean;
	isDownVote: boolean;
}

export type IVoteModel = IVote & mongoose.Document;

export const VoteSchema = new mongoose.Schema<IVoteModel>(
	{
		postId: {
			type: mongoose.Types.ObjectId,
			ref: "Post",
			require: true,
		},
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			require: true,
		},
		isUpVote: {
			type: Boolean,
			default: false,
		},
		isDownVote: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Vote = mongoose.model<IVoteModel>("Vote", VoteSchema);

export default Vote;
