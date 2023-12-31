import { Router } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

import Post from "../models/posts";
import Vote from "../models/vote";
import User from "../models/user";
import mongoose from "mongoose";

const postRouter = Router();

const OFFSET = 10;

postRouter.get("/all", verifySession(), async (req: SessionRequest, res) => {
	const page = Number(req.query.page) || 1;
	const skip = (page - 1) * OFFSET;
	const supertokensId = req.session?.getUserId();
	const user = await User.findOne({ supertokensId });
	try {
		const posts = await Post.find({})
			.populate("user")
			.skip(skip)
			.limit(OFFSET)
			.sort({ _id: -1 });

		const totalPost = (await Post.find({}).countDocuments()) - page * OFFSET;

		const postsWithUpvotes = [];
		for (const post of posts) {
			const votes = await Vote.aggregate([
				{
					$match: {
						postId: post._id,
					},
				},

				{
					$group: {
						_id: "$postId",
						upvoteCount: {
							$sum: {
								$cond: [{ $eq: ["$isUpVote", true] }, 1, 0],
							},
						},
						downVoteCount: {
							$sum: {
								$cond: [{ $eq: ["$isDownVote", true] }, 1, 0],
							},
						},
						isUserDownvoted: {
							$sum: {
								$cond: [
									{
										$and: [
											{ $eq: ["$userId", user?._id] },
											{ $eq: ["$isDownVote", true] },
										],
									},
									1,
									0,
								],
							},
						},
						isUserUpvoted: {
							$sum: {
								$cond: [
									{
										$and: [
											{ $eq: ["$userId", user?._id] },
											{ $eq: ["$isUpVote", true] },
										],
									},
									1,
									0,
								],
							},
						},
					},
				},
			]);
			postsWithUpvotes.push({
				...post.toObject(),
				votes: {
					upvotes: votes[0]?.upvoteCount ?? 0,
					downvotes: votes[0]?.downVoteCount ?? 0,
					isUserUpvoted: votes[0]?.isUserUpvoted ?? false,
					isUserDownvoted: votes[0]?.isUserDownvoted ?? false,
				},
			});
		}
		return res
			.status(200)
			.json({
				message: "ok",
				data: { posts: postsWithUpvotes, pagable: totalPost >= 1 },
			});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "something went wrong!" });
	}
});

postRouter.post(
	"/create",
	verifySession(),
	async (req: SessionRequest, res) => {
		if (!req.body.title || !req.body.content) {
			return res
				.status(401)
				.json({ message: "Please pass the the require fields" });
		}
		const { title, content } = req.body;
		const supertokensId = req.session?.getUserId();

		const user = await User.findOne({ supertokensId });

		if (!user) {
			return res.status(404).json({ message: "user not found!" });
		}

		try {
			const post = await Post.create({
				title,
				content,
				user: user._id,
			});
			return res.status(200).json({
				message: "new post has been created created",
				post: { ...post.toObject(), user: user.toObject() },
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json({ message: "something went wrong!" });
		}
	}
);

postRouter.get("/upvote", verifySession(), async (req: SessionRequest, res) => {
	const postId = req.query.postId;
	const supertokensId = req.session?.getUserId();

	if (!postId) {
		return res.status(401).json({ message: "Please pass a valid postId" });
	}

	if (!supertokensId) {
		return res.status(403).json({ message: "This request has been forbidden" });
	}

	const user = await User.findOne({ supertokensId }, "_id");

	if (!user) {
		return res.status(404).json({ message: "user not found!" });
	}

	try {
		const vote = await Vote.findOne({
			postId: new mongoose.Types.ObjectId(postId as string),
			userId: user._id,
			$or: [{ isUpVote: { $eq: true } }, { isDownVote: { $eq: true } }],
		});

		if (!vote) {
			await Vote.create({
				postId,
				userId: user._id,
				isUpVote: true,
			});
		} else if (vote.isDownVote) {
			vote.isUpVote = true;
			vote.isDownVote = false;
			await vote.save();
		} else if (vote.isUpVote) {
			vote.isUpVote = false;
			await vote.save();
		}
	} catch (err) {
		console.log(err);
		return res.status(401).json({ message: "something went wrong!" });
	}

	return res.status(200).json({ message: "upvoted" });
});

postRouter.get(
	"/downvote",
	verifySession(),
	async (req: SessionRequest, res) => {
		const postId = req.query.postId;
		const supertokensId = req.session?.getUserId();

		if (!postId) {
			return res.status(401).json({ message: "Please pass a valid postId" });
		}

		if (!supertokensId) {
			return res
				.status(403)
				.json({ message: "This request has been forbidden" });
		}
		const user = await User.findOne({ supertokensId }, "_id");

		if (!user) {
			return res.status(404).json({ message: "user not found!" });
		}

		try {
			const vote = await Vote.findOne({
				postId,
				userId: user._id,
				$or: [{ isUpVote: { $eq: true } }, { isDownVote: { $eq: true } }],
			});

			if (!vote) {
				await Vote.create({
					postId,
					userId: user._id,
					isDownVote: true,
				});
			} else if (vote.isUpVote) {
				vote.isUpVote = false;
				vote.isDownVote = true;
				await vote.save();
			} else if (vote.isDownVote) {
				vote.isDownVote = false;
				await vote.save();
			}
		} catch (err) {
			console.log(err);
			return res.status(401).json({ message: "something went wrong!" });
		}

		return res.status(200).json({ message: "upvoted" });
	}
);

export default postRouter;
