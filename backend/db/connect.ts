import mongoose from "mongoose";

mongoose.set("debug", true);

async function connectDB() {
	await mongoose.connect("mongodb://127.0.0.1:27017/test");
}

export default connectDB;
