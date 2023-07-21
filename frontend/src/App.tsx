import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";

import { PreBuiltUIList, SuperTokensConfig } from "./config";
import Feed from "./pages/Feed";
import Header from "./components/navigation/Header";

import styles from "./App.module.css";

SuperTokens.init(SuperTokensConfig);

function App() {
	return (
		<SuperTokensWrapper>
			<div className={styles.container}>
				<Router>
					<Header />
					<Routes>
						{/* This shows the login UI on "/auth" route */}
						{getSuperTokensRoutesForReactRouterDom(
							require("react-router-dom"),
							PreBuiltUIList
						)}

						<Route
							path="/"
							element={
								<SessionAuth>
									<Feed />
								</SessionAuth>
							}
						/>
					</Routes>
				</Router>
			</div>
		</SuperTokensWrapper>
	);
}

export default App;
