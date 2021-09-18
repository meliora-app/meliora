import admin from 'firebase-admin';
admin.initializeApp();

const decodeIDToken = async (req, res, next) => {
	const authToken = req.headers.authorization;

	if (authToken) {
		const idToken = authToken.split('Bearer ')[1];

		try {
			const decodedToken = await admin.auth().verifyIdToken(idToken);
			req['currentUser'] = decodedToken;
		} catch (e) {
			console.error(e);
		}
	}

	next();
};

export { decodeIDToken };