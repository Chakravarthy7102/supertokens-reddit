import { Router } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

import Post from "../models/posts";
import Vote from "../models/vote";

const postRouter = Router();

const OFFSET = 10;

postRouter.get("/all", async (req, res) => {
	const page = Number(req.query.page) || 1;
	const skip = (page - 1) * OFFSET;
	try {
		const posts = await Post.find({}).skip(skip).limit(OFFSET);
		return res.status(200).json({ message: "ok", data: { posts } });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "something went wrong!" });
	}
});

postRouter.post(
	"/create",
	verifySession(),
	async (req: SessionRequest, res) => {
		const { title, content } = req.body;
		const userId = req.session?.getUserId();

		if (!title || !content) {
			return res
				.status(401)
				.json({ message: "Please pass the the require fields" });
		}

		console.log(req.session);

		try {
			const post = await Post.create({
				title,
				content,
				user: userId,
			});
			console.log({ post });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ message: "something went wrong!" });
		}

		return res
			.status(200)
			.json({ message: "new post has been created created" });
	}
);

postRouter.get("/upvote", verifySession(), async (req: SessionRequest, res) => {
	const postId = req.query.postId;
	const userId = req.session?.getUserId();

	if (!postId) {
		return res.status(401).json({ message: "Please pass a valid postId" });
	}

	if (!userId) {
		return res.status(403).json({ message: "This request has been forbidden" });
	}
	try {
		const vote = await Vote.findOne({
			postId,
			userId,
			isUpVote: true,
		});

		if (!vote) {
			await Vote.create({
				postId,
				userId,
				isUpVote: true,
			});
		} else if (vote.isDownVote) {
			vote.isUpVote = true;
			vote.isDownVote = false;
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
		const userId = req.session?.getUserId();

		if (!postId) {
			return res.status(401).json({ message: "Please pass a valid postId" });
		}

		if (!userId) {
			return res
				.status(403)
				.json({ message: "This request has been forbidden" });
		}
		try {
			const vote = await Vote.findOne({
				postId,
				userId,
				isDownVote: true,
			});

			if (!vote) {
				await Vote.create({
					postId,
					userId,
					isDownVote: true,
				});
			} else if (vote.isUpVote) {
				vote.isUpVote = false;
				vote.isDownVote = true;
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
