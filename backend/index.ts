import express, { json } from "express";
import cors from "cors";
import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import {
	middleware,
	errorHandler,
	SessionRequest,
} from "supertokens-node/framework/express";
import { getWebsiteDomain, SuperTokensConfig } from "./config";
import connectDB from "./db/connect";
import postRouter from "./routes/post.routes";

supertokens.init(SuperTokensConfig);

const app = express();

app.use(
	cors({
		origin: getWebsiteDomain(),
		allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
		methods: ["GET", "PUT", "POST", "DELETE"],
		credentials: true,
	})
);

// This exposes all the APIs from SuperTokens to the client.
app.use(json());
app.use(middleware());

app.use("/api/posts", postRouter);

// An example API that requires session verification
app.get("/sessioninfo", verifySession(), async (req: SessionRequest, res) => {
	let session = req.session;
	res.send({
		sessionHandle: session!.getHandle(),
		userId: session!.getUserId(),
		accessTokenPayload: session!.getAccessTokenPayload(),
	});
});

// In case of session related errors, this error handler
// returns 401 to the client.
app.use(errorHandler());

connectDB()
	.then(() => {
		console.log("DB connected successful");
	})
	.catch((err) => {
		console.error("error", err);
	});

app.listen(3001, () => console.log(`API Server listening on port 3001`));
