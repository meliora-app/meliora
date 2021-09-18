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
 * Endpoint to get all posts
 */
postRouter.get('/getAll', (req, res) => {

});

/**
 * Endpoint to create a post
 */
postRouter.post('/create', (req, res) => {

});

/**
 * Endpoint to delete a post
 */
postRouter.delete('/delete', (req, res) => {

});

/**
 * Endpoint to get posts
 * from a specified author
 */
postRouter.get('/getPostsBy', (req, res) => {

});

export { postRouter };