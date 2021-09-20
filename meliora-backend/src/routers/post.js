/**
 * Router for all things Posts
 * 
 * 09-14-21
 * Xavier Madera
 */
import { Router } from 'express';

import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

const postRouter = new Router();

/**
 * Util Function to validate a new post
 */
const isValidPost = (post) => {
	return (post.author && post.title && post.content);
}

/**
 * Endpoint to get all posts
 */
postRouter.get('/getAll', async (req, res) => {

});

/**
 * Endpoint to create a post
 */
postRouter.post('/create', async (req, res) => {

	let newPost = req.body;

	if (!isValidPost(newPost)) {
		res.status(400).send("The object structure of this post was invalid!");
		return;
	}

	let postDocument;
	try {

		postDocument = await new Post(newPost).save();

		let user = await User.findById(newPost.author).exec();

		user.authorList.push(postDocument._id);

		await user.save();

	} catch (e) {
		res.status(500).send("An error occurred on the backend.");
		console.error(e);
		return;
	}

	res.status(200).send({
		_id: postDocument._id,
		msg: 'Post created successfully'
	});
	return;
});

/**
 * Endpoint to flag a post
 */
postRouter.patch('/flag', async (req, res) => {

	let { post, flagger } = req.body;

	if (!post || !flagger) {
		res.status(400).send('You must send in a post ID and a user ID for the user flagging!');
		return;
	}

	let postDoc;
	try {

		postDoc = await Post.findById(post).exec();

		if (!postDoc) {
			res.status(400).send('This post doesn\'t exist!');
			return;
		}

		let userDoc = await User.findById(flagger).exec();

		if (!userDoc) {
			res.status(400).send('This user doesn\'t exist!');
			return;
		}

		postDoc.flags = postDoc.flags + 1;

		await postDoc.save();

	} catch (e) {
		res.status(500).send('An error occurred on the backend.');
		return;
	}

	res.status(200).send('Post Flagged Successfully.');
	return;
});

/**
 * Endpoint to delete a post
 */
postRouter.delete('/delete', async (req, res) => {

});

/**
 * Endpoint to get posts
 * from a specified author
 */
postRouter.get('/getPostsBy', async (req, res) => {

});

export { postRouter };