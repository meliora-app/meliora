import { Router } from "express";

import { User } from "../models/User.js";

import { Post } from "../models/Post.js";

const adminRouter = Router();


/**
 * Create an Admin
 */
adminRouter.put('/', async (req, res) => {
	let { userID } = req.body;

	if (!userID) {
		res.status(400).send('You must send in a user ID!');
		return;
	}

	try {

		let user = await User.findById(userID).exec();

		if (!user) {
			res.status(400).send('This user doesn\'t exist.');
			return;
		}

		user.admin = (!user.admin);

		await user.save();
		
	} catch (e) {
		console.error(e);
		res.status(500).send('An error occured on the backend.');
		return;
	}

	res.status(200).send(true);
});

/**
 * Retrieve all delinquent posts for review.
 */
adminRouter.get('/review', async (req, res) => {
	let delPosts = [];
	try {
		delPosts = await Post.find({ delinquent: true }).exec();
	} catch (e) {
		console.error(e);
		res.status(500).send('An error occured on the backend.');
		return;
	}

	res.status(200).send(delPosts);
});

/**
 * Remove a post or clear its flags.
 */
adminRouter.put('/eval', async (req, res) => {
	// decision == true to delete post.
	// decision == false to clear its flags.
	let { postID, decision } = req.body;

	if (!postID || decision === undefined) {
		res.status(400).send('Request body was invalid!');
		return;
	}

	try {

		if (decision) {
			await Post.findByIdAndDelete(postID).exec();
		} else {
			await Post.findByIdAndUpdate(postID, { flags: 0, delinquent: false }).exec();
		}

	} catch (e) {
		console.error(e);
		res.status(500).send('An error occured on the backend.');
		return;
	}

	res.status(200).send(true);
	return;
});


export { adminRouter };