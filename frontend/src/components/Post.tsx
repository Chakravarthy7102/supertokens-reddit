import { useState } from "react";

import { DownVoteIcon, UpVoteIcon } from "../icons";
import styles from "./post.module.css";
import { fromNow } from "../utils/fromNow";

export interface PostI {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
	user: {
		username: string;
		avatar: string;
	};
}

export default function Post({
	content,
	title,
	user,
	_id: postId,
	createdAt,
}: PostI) {
	return (
		<div className={styles.card}>
			<div className={styles.card__top}>
				<img className={styles.profile__pic} src={user.avatar} alt="image" />
				<span className={styles.username}>{user.username}</span>
				<span className={styles.created__at}>
					{fromNow(new Date(createdAt))}
				</span>
			</div>
			<h2>{title}</h2>
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
