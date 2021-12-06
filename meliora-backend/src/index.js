import { server } from './server.js';
import { connectToDB } from './util/db.js';
import { initializeNewFields } from './util/initializeNewFields.js';

const PORT = process.env.PORT || 8000;

const start = async () => {

	try {
		await connectToDB(process.env.DB_CONNECTION_STRING);
		console.log('Connected to Mongo!');

		/* Initialize new Fields in DB. */
		initializeNewFields();
	} catch (e) {
		console.error(e);
		process.exit(1);
	}

	server.listen(PORT, () => {
		console.log(`Server Listening on Port ${PORT}`);
	});
};

start();