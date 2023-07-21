import styles from "./button.module.css";

import { Loader } from "../../../icons";

type ButtonProps = JSX.IntrinsicElements["button"] & {
	isLoading?: boolean;
};

export default function Button({ isLoading, children, ...props }: ButtonProps) {
	return (
		<button disabled={isLoading} className={styles.button} {...props}>
			{isLoading ? (
				<div className={styles.loader__container}>
					<Loader className={styles.button__loader} />
				</div>
			) : null}
			{children}
		</button>
	);
}
