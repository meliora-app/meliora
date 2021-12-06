import { User } from '../models/User.js';
import { Post } from '../models/Post.js';

const initializeNewFields = async () => {
	initializeNewUserFields();
	initializeNewPostFields();
};

const initializeNewUserFields = async () => {

};

const initializeNewPostFields = async () => {
	try {

		let posts = await Post.find().exec();

		let i = 0, n = posts.length;

		while (i < n) {

			let post = posts[i];

			if ( !("hasPhoto" in post) )
				post.hasPhoto = false;

			await post.save();

			i++;

		}

	} catch (e) {
		console.error("Error Initializing New Post Fields.");
		console.error(e);
	}
};

export { initializeNewFields };