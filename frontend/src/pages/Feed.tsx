import { useEffect, useState } from "react";
import Post from "../components/Post";

import styles from "./feed.module.css";
import { getPosts } from "../api/post";
import { usePostsAtom } from "../atoms/postAtom";
import FullscreenLoader from "../components/FullscreenLoader";

export default function Feed() {
	const [posts, setPosts] = usePostsAtom();
	const [isFetching, setIsFetching] = useState(true);

	useEffect(() => {
		getPosts()
			.then((res) => {
				setPosts(res.data.posts);
				console.log(res.data.posts);
				setIsFetching(false);
			})
			.catch((err) => {
				console.log(err);
				setIsFetching(false);
			});
	}, []);

	return (
		<div className={styles.feed__container}>
			{!posts.length && !isFetching ? <NoPosts /> : null}
			{isFetching ? <FullscreenLoader /> : null}
			{posts.map((post) => {
				return <Post key={post._id} {...post} />;
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
