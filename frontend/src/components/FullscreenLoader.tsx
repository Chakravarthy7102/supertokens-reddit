import { Loader } from "../icons";
import styles from "./fullscreenLoader.module.css";

export default function FullscreenLoader() {
	return (
		<div className={styles.fullscreen__loader}>
			<Loader />
		</div>
	);
}
