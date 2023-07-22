import { useNavigate } from "react-router-dom";
import {
	signOut,
	useSessionContext,
} from "supertokens-auth-react/recipe/session";

import styles from "./header.module.css";
import { useState } from "react";
import { Plus } from "../../icons";
import Modal from "../ui/modal";
import Button from "../ui/button";
import { createPost } from "../../api/post";
import { usePostsAtom } from "../../atoms/postAtom";

export default function Header() {
	const navigate = useNavigate();

	const session = useSessionContext();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [loggingOut, setLogginOut] = useState(false);

	const [posts, setPosts] = usePostsAtom();

	async function logoutClicked() {
		setLogginOut(true);
		await signOut();
		setLogginOut(false);
		navigate("/auth");
	}

	function handlePost(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		const title = document.querySelector("input")?.value;
		const content = document.querySelector("textarea")?.value;

		if (!title || !content || title.length < 3 || content?.length < 3) {
			alert("Please enter valid title or content.");
			setIsLoading(false);
			return;
		}

		createPost({ title, content })
			.then((res) => {
				setPosts([
					{
						...res.post,
						votes: {
							downvotes: 0,
							upvotes: 0,
							isUserDownvoted: false,
							isUserUpvoted: false,
						},
					},
					...posts,
				]);
				setIsLoading(false);
				setIsModalOpen(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
				setIsModalOpen(false);
				alert("something went wrong while, creating post.");
			});
	}

	return (
		<header>
			<div className={styles.title__block}>
				<img
					className={styles.logo}
					src="https://styles.redditmedia.com/t5_2w844/styles/communityIcon_krq4riav5m191.png?width=256&s=3bb045009d2a9d1d7543dc7afb7b53a0e6f18121"
					alt="logo"
				/>
				<span className={styles.title}>
					Para<span className={styles.text__orange}>.</span>
				</span>
			</div>
			{!session.loading && session.userId ? (
				<div className={styles.title__block}>
					<Plus onClick={() => setIsModalOpen(true)} className={styles.plus} />
					<Button isLoading={loggingOut} onClick={logoutClicked}>
						Logout
					</Button>
				</div>
			) : null}
			{isModalOpen ? (
				<Modal handleClose={() => setIsModalOpen(false)} title="Post">
					<form onSubmit={handlePost}>
						<input type="text" name="title" id="title" placeholder="title" />
						<textarea
							name="content"
							id="content"
							cols={30}
							rows={30}
							placeholder="Enter something..."
						></textarea>
						<Button type="submit" isLoading={isLoading}>
							Post
						</Button>
					</form>
				</Modal>
			) : null}
		</header>
	);
}
