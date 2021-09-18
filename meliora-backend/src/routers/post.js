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