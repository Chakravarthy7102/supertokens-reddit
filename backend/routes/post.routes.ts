import { Router } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

const postRouter = Router();

postRouter.get("/all", (req: SessionRequest, res) => {
	return res.status(200).json({ message: "posts" });
});

postRouter.post("/create", verifySession(), (req: SessionRequest, res) => {
	return res.status(200).json({ message: "created" });
});

postRouter.get("/upvote", verifySession(), (req: SessionRequest, res) => {
	return res.status(200).json({ message: "upvoted" });
});

postRouter.get("/downvote", verifySession(), (req: SessionRequest, res) => {
	return res.status(200).json({ message: "upvoted" });
});

export default postRouter;
