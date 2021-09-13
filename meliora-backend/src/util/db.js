import mongoose from 'mongoose';

const connectToDB = async (connectionString) => {
	await mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

export { connectToDB };