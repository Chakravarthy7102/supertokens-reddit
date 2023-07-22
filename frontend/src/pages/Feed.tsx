import { useEffect, useState } from "react";
import Post, { PostI } from "../components/Post";

import styles from "./feed.module.css";
import { getPosts } from "../api/post";

export default function Feed() {
	const [posts, setPosts] = useState<Array<PostI>>([]);

	useEffect(() => {
		getPosts()
			.then((res) => {
				console.log("res", res.data.posts);
				setPosts(res.data.posts);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div className={styles.feed__container}>
			{posts.length ? null : <NoPosts />}
			{posts.map((data, index) => {
				return <Post key={index} {...data} />;
			})}
		</div>
	);
}

const imageUrl =
	"https://play-lh.googleusercontent.com/Xm6RBzAhQL05D1MaAeUNidcm8SkGJmVXO0L8ZwQjm4yZ5LQzSJQw68Rn4bfinJU2eGQw";

function NoPosts() {
	return (
		<div className={styles.noresult__container}>
			<img
				className={styles.noresult__img}
				src={imageUrl}
				alt="reddit__image"
			/>
			<p>
				{`No Post found :(`}
				<span>There are no active post created, so create one!</span>
			</p>
		</div>
	);
}
