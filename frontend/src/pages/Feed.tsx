import { useCallback, useEffect, useState } from "react";
import Post from "../components/Post";

import styles from "./feed.module.css";
import { getPosts } from "../api/post";
import { usePostsAtom } from "../atoms/postAtom";
import FullscreenLoader from "../components/FullscreenLoader";
import Button from "../components/ui/button";

export default function Feed() {
	const [posts, setPosts] = usePostsAtom();
	const [isFetching, setIsFetching] = useState(true);
	const [pagable, setIsPagable] = useState(false);
	const [page, setPage] = useState(1);

	const fetchPosts = useCallback(
		(page: number) => {
			setIsFetching(true);
			getPosts(page)
				.then((res) => {
					setIsFetching(false);
					setIsPagable(res.data.pagable);
					setPosts([...posts, ...res.data.posts]);
				})
				.catch((err) => {
					console.log(err);
					setIsFetching(false);
				});
		},
		[page]
	);

	useEffect(() => {
		fetchPosts(page);
	}, [page]);

	return (
		<div className={styles.feed__container}>
			{!posts.length && !isFetching ? <NoPosts /> : null}
			{isFetching ? <FullscreenLoader /> : null}
			{posts.map((post) => {
				return <Post key={post._id} {...post} />;
			})}
			{pagable ? (
				<Button
					isLoading={isFetching}
					onClick={() => setPage(page + 1)}
					className={styles.loadmore__button}
				>
					Load More!
				</Button>
			) : null}
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
