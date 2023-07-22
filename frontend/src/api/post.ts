import { getApiDomain } from "../config";

const POST_API_PREFIX = "/api/posts";

export async function getPosts(page: number) {
	const promise = await fetch(
		getApiDomain() + POST_API_PREFIX + `/all?page=${page}`
	);
	const response = await promise.json();
	return response;
}

export async function createPost(payload: { title: string; content: string }) {
	const promise = await fetch(getApiDomain() + POST_API_PREFIX + "/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	const response = await promise.json();
	return response;
}

export async function upVotePost(postId: string) {
	const promise = await fetch(
		getApiDomain() + POST_API_PREFIX + `/upvote?postId=${postId}`
	);
	const response = await promise.json();
	return response;
}

export async function downVotePost(postId: string) {
	const promise = await fetch(
		getApiDomain() + POST_API_PREFIX + `/downvote?postId=${postId}`
	);
	const response = await promise.json();
	return response;
}
