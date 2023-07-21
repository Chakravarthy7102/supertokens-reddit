import { useState } from "react";
import Post from "../components/Post";

import styles from "./feed.module.css";

export default function Feed() {
	const [posts, setPosts] = useState(
		new Array(100).fill("random text", 0, 100)
	);
	const [createPost, setCreatePost] = useState(false);

	return (
		<div className={styles.feed__container}>
			{posts.map((content) => {
				return <Post content={content} />;
			})}
		</div>
	);
}

interface CreatePostI {
	setPosts: React.Dispatch<React.SetStateAction<any[]>>;
	posts: string[];
}

function CreatePost({ posts, setPosts }: CreatePostI) {
	function handleCreatePost() {
		const content = document.getElementById("content") as
			| JSX.IntrinsicElements["textarea"]
			| null;
		if (content) setPosts([content.value, ...posts]);
	}
	return (
		<div>
			<textarea name="content" id="content" cols={30} rows={10}></textarea>
			<button onClick={handleCreatePost}>create</button>
		</div>
	);
}
