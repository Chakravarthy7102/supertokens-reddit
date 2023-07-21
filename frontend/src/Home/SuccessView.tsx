import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { CelebrateIcon, SeparatorLine, SignOutIcon } from "../assets/images";

interface ILink {
	name: string;
	onClick: () => void;
	icon: string;
}

export default function SuccessView(props: { userId: string }) {
	let userId = props.userId;

	const navigate = useNavigate();

	async function logoutClicked() {
		await signOut();
		navigate("/auth");
	}

	const links: ILink[] = [
		{
			name: "Sign Out",
			onClick: logoutClicked,
			icon: SignOutIcon,
		},
	];

	return (
		<>
			<div className="main-container">
				<div className="top-band success-title bold-500">
					<img
						src={CelebrateIcon}
						alt="Login successful"
						className="success-icon"
					/>{" "}
					Login successful
				</div>
				<div className="inner-content">
					<div>Your userID is:</div>
					<div className="truncate" id="user-id">
						{userId}
					</div>
				</div>
			</div>
			<div className="bottom-links-container">
				{links.map((link) => (
					<div className="link" key={link.name}>
						<img className="link-icon" src={link.icon} alt={link.name} />
						<div role={"button"} onClick={link.onClick}>
							{link.name}
						</div>
					</div>
				))}
			</div>
			<img className="separator-line" src={SeparatorLine} alt="separator" />
		</>
	);
}
