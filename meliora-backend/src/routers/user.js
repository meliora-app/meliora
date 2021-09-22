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

export { userRouter };