import { Router } from 'express';

import { User } from '../models/User.js';

const userRouter = Router();

/**
 * Util func to make sure input is correct format
 */
const isValidUser = (user) => {
	return (user.email && user.username && user.password);
};


/**
 * Signup
 */
userRouter.post('/signup', async (req, res) => {

	let user = req.body;

	if (!isValidUser(user)) {
		res.status(400).send('The object structure of this user was invalid!');
		return;
	}

	let userDoc;

	try {

		userDoc = await User.findOne({ username: user.username }).exec();

		if (userDoc) {
			res.status(400).send('This username is taken!');
			return;
		}

		userDoc = await new User(user).save();

	} catch (e) {
		console.error(e);
		res.status(500).send('An error occured on the backend.');
		return;
	}

	res.status(200).send({
		_id: userDoc._id,
		msg: 'User signup successful!'
	});

});

/**
 * Login
 */
userRouter.get('/login', async (req, res) => {
	let user = req.body;

	if (!user || !user.username) {
		res.status(400).send('You must send in the username!');
		return;
	}

	let userDoc;
	try {

		userDoc = await User.findOne({ username: user.username }).exec();

		if (!userDoc) {
			res.status(400).send('This user does not exist!');
			return;
		}

	} catch (e) {
		console.error(e);
		res.status(500).send('An error occurred on the backend.');
		return;
	}

	res.status(200).send({
		_id: userDoc._id,
		darkModeStatus: userDoc.darkModeStatus
	});
});

export { userRouter };