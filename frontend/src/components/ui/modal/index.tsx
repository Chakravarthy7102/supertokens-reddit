import { X } from "../../../icons";

import styles from "./modal.module.css";

interface ModalI {
	children: React.ReactNode;
	title: string;
	handleClose: () => void;
}

export default function Modal({ children, title, handleClose }: ModalI) {
	return (
		<div className={styles.overlay}>
			<div className={styles.modal__card}>
				<div className={styles.modal__title}>
					<h2>{title}</h2>
					<X onClick={handleClose} />
				</div>
				{children}
			</div>
		</div>
	);
}
