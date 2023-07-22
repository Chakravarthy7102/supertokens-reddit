const Fakerator = require("fakerator");

import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import Dashboard from "supertokens-node/recipe/dashboard";
import User from "./models/user";

function generateRandomUsername() {
	const f = new Fakerator("hu-HU");
	return f.names.lastName();
}

function generateRandomAvatar() {
	const f = new Fakerator("hu-HU");
	return f.internet.gravatar();
}

export function getApiDomain() {
	const apiPort = process.env.REACT_APP_API_PORT || 3001;
	const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
	return apiUrl;
}

export function getWebsiteDomain() {
	const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
	const websiteUrl =
		process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
	return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
	supertokens: {
		// this is the location of the SuperTokens core.
		connectionURI: "https://try.supertokens.com",
	},
	appInfo: {
		appName: "SuperTokens Demo App",
		apiDomain: getApiDomain(),
		websiteDomain: getWebsiteDomain(),
	},
	// recipeList contains all the modules that you want to
	// use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
	recipeList: [
		ThirdPartyEmailPassword.init({
			providers: [
				// We have provided you with development keys which you can use for testing.
				// IMPORTANT: Please replace them with your own OAuth keys for production use.
				ThirdPartyEmailPassword.Google({
					clientId:
						"1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
					clientSecret: "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",
				}),
			],
			override: {
				functions: (originalImplementation) => {
					return {
						...originalImplementation,
						emailPasswordSignUp: async function (input) {
							let response = await originalImplementation.emailPasswordSignUp(
								input
							);

							if (response.status === "OK") {
								console.log({
									username: generateRandomUsername(),
									avatar: generateRandomAvatar(),
									supertokensId: response.user.id,
								});

								await User.create({
									username: generateRandomUsername(),
									avatar: generateRandomAvatar(),
									supertokensId: response.user.id,
								});
							}

							return response;
						},
						thirdPartySignInUp: async function (input) {
							let response = await originalImplementation.thirdPartySignInUp(
								input
							);

							if (response.status === "OK") {
								// let firstName =
								// 	//@ts-ignore
								// 	response.rawUserInfoFromProvider.fromUserInfoAPI![
								// 		"first_name"
								// 	];
								if (response.createdNewUser) {
									console.log({
										username: generateRandomUsername(),
										avatar: generateRandomAvatar(),
										supertokensId: response.user.id,
									});

									await User.create({
										username: generateRandomUsername(),
										avatar: generateRandomAvatar(),
										supertokensId: response.user.id,
									});
								}
							}

							return response;
						},
					};
				},
			},
		}),
		Session.init(),
		Dashboard.init(),
	],
};
