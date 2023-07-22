import User from "../models/user";

async function getUserIdWithSupertokensId(supertokensId: string) {
	const user = await User.findOne({ supertokensId }, "_id");
	if (!user) {
		return null;
	}
	return user._id;
}
