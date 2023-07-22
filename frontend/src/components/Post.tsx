import { useState } from "react";

import { DownVoteIcon, UpVoteIcon } from "../icons";
import styles from "./post.module.css";

export interface PostI {
	title: string;
	content: string;
	user: {
		username: string;
		avatar: string;
	};
}

export default function Post({ content, title, user }: PostI) {
	return (
		<div className={styles.card}>
			<div className={styles.card__top}>
				<img
					className={styles.profile__pic}
					src="https://styles.redditmedia.com/t5_2w844/styles/communityIcon_krq4riav5m191.png?width=256&s=3bb045009d2a9d1d7543dc7afb7b53a0e6f18121"
					alt="image"
				/>
				<span className={styles.username}>Thorffin</span>
			</div>
			<p>{content}</p>
			<ActionBar />
		</div>
	);
}

function ActionBar() {
	const [upvoted, setUpvoted] = useState(false);
	const [downVoted, setDownvoted] = useState(false);
	const [upVotesCount, setUpvoteCount] = useState(0);
	const [downVotesCount, setDownVotesCount] = useState(0);

	function handleUpvote() {
		if (!upvoted) {
			if (downVoted) {
				setDownvoted(false);
				setDownVotesCount(downVotesCount - 1);
			}
			setUpvoted(true);
			setDownvoted(false);
			setUpvoteCount(upVotesCount + 1);
		} else {
			setUpvoted(false);
			setUpvoteCount(upVotesCount - 1);
		}
	}

	function handleDownvote() {
		if (!downVoted) {
			if (upvoted) {
				setUpvoted(false);
				setUpvoteCount(upVotesCount - 1);
			}
			setDownvoted(true);
			setUpvoted(false);
			setDownVotesCount(downVotesCount + 1);
		} else {
			setDownvoted(false);
			setDownVotesCount(downVotesCount - 1);
		}
	}

	return (
		<div className={styles.action__bar}>
			<span className={styles.center__items}>
				<UpVoteIcon
					onClick={handleUpvote}
					className={upvoted ? styles.fill__red : undefined}
				/>
				<span>{upVotesCount}</span>
			</span>
			<span className={styles.center__items}>
				<DownVoteIcon
					onClick={handleDownvote}
					className={downVoted ? styles.fill__red : undefined}
				/>
				<span>{downVotesCount}</span>
			</span>
		</div>
	);
}
