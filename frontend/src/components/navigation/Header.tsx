import { useNavigate } from "react-router-dom";
import {
	signOut,
	useSessionContext,
} from "supertokens-auth-react/recipe/session";

import styles from "./header.module.css";
import { useCallback, useState } from "react";
import { Plus } from "../../icons";
import Modal from "../ui/modal";
import Button from "../ui/button.tsx";

export default function Header() {
	const navigate = useNavigate();

	const session = useSessionContext();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	async function logoutClicked() {
		await signOut();
		navigate("/auth");
	}

	function handlePost() {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 2000);
	}

	const ProtectedPart = useCallback(() => {
		if (session.loading) {
			return null;
		}
		return session.userId ? (
			<div className={styles.title__block}>
				<Plus onClick={() => setIsModalOpen(true)} className={styles.plus} />
				<Button onClick={logoutClicked}>Logout</Button>
			</div>
		) : null;
	}, [session]);

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
			<ProtectedPart />
			{isModalOpen ? (
				<Modal handleClose={() => setIsModalOpen(false)} title="Post">
					<textarea
						name="content"
						id="content"
						cols={30}
						rows={30}
						placeholder="Enter something..."
					></textarea>
					<Button isLoading={isLoading} onClick={handlePost}>
						Post
					</Button>
				</Modal>
			) : null}
		</header>
	);
}