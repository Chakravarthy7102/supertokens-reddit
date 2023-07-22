import { useState } from "react";

import { DownVoteIcon, UpVoteIcon } from "../icons";
import styles from "./post.module.css";
import { fromNow } from "../utils/fromNow";
import { downVotePost, upVotePost } from "../api/post";

interface Votes {
	upvotes: number;
	downvotes: number;
	isUserDownvoted: boolean;
	isUserUpvoted: boolean;
}

export interface PostI {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
	votes: Votes;
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
	votes,
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
			<ActionBar postId={postId} {...votes} />
		</div>
	);
}

interface ActionBarProps extends Votes {
	postId: string;
}

function ActionBar({
	postId,
	downvotes,
	upvotes,
	isUserDownvoted,
	isUserUpvoted,
}: ActionBarProps) {
	const [upvoted, setUpvoted] = useState(isUserUpvoted);
	const [downVoted, setDownvoted] = useState(isUserDownvoted);
	const [upVotesCount, setUpvoteCount] = useState(upvotes);
	const [downVotesCount, setDownVotesCount] = useState(downvotes);

	function handleUpvote() {
		if (!upvoted) {
			if (downVoted) {
				setDownvoted(false);
				setDownVotesCount(downVotesCount - 1);
			}
			setUpvoted(true);
			setDownvoted(false);
			setUpvoteCount(upVotesCount + 1);
			upVotePost(postId).catch((err) => {
				console.log(err);
				alert("error while upvoting!");
			});
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
			downVotePost(postId).catch((err) => {
				console.log(err);
				alert("error while down voting!");
			});
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
