/**
 * Router for all things Posts
 *
 * 09-14-21
 * Xavier Madera
 */
import { Router } from "express";

import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

let { ObjectId } = mongoose.Types;

const postRouter = new Router();

/**
 * Util Function to validate a new post
 */
const isValidPost = (post) => {
  console.log("post:", post);
  console.log(
    "and result: ",
    "author" in post &&
      "title" in post &&
      "content" in post &&
      "anonymous" in post &&
      "hidden" in post
  );
  return (
    "author" in post &&
    "title" in post &&
    "content" in post &&
    "anonymous" in post &&
    "hidden" in post
  );
};

/**
 * Endpoint to get all posts
 */
postRouter.get("/getAll", async (req, res) => {
  let allPosts = [];

  try {
    allPosts = await Post.find({}).exec();

    if (!allPosts || allPosts.length == 0) {
      res.status(400).send("There are no posts!");
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occured on the backend.");
    return;
  }

  res.status(200).send(allPosts);
  return;
});

/**
 * Get a single post
 * Xavier Madera
 */
postRouter.put("/getPost", async (req, res) => {
  let { post } = req.body;
  try {
    post = await Post.findById(post).exec();

    if (!post) {
      res.status(400).send('There is no post with this ID.');
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend.');
    return;
  }

  res.status(200).send(post);
  return;
});

/**
 * Endpoint to create a post
 */
postRouter.post("/create", async (req, res) => {
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
    msg: "Post created successfully",
  });
  return;
});

/**
 * Endpoint to flag a post
 */
postRouter.patch("/flag", async (req, res) => {
  let { post, flagger } = req.body;

  if (!post || !flagger) {
    res
      .status(400)
      .send("You must send in a post ID and a user ID for the user flagging!");
    return;
  }

  let postDoc;
  try {
    postDoc = await Post.findById(post).exec();

    if (!postDoc) {
      res.status(400).send("This post doesn't exist!");
      return;
    }

    let userDoc = await User.findById(flagger).exec();

    if (!userDoc) {
      res.status(400).send("This user doesn't exist!");
      return;
    }

    postDoc.flags = postDoc.flags + 1;

    if (postDoc.flags >= 5) {
      postDoc.delinquent = true;
    }

    await postDoc.save();
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occurred on the backend.");
    return;
  }

  res.status(200).send("Post Flagged Successfully.");
  return;
});

/**
 * Endpoint to delete a post by _id
 * Garrett Lee
 */
postRouter.delete("/deletePost", async (req, res) => {
  let post = req.body;

  if (!post._id || !post.author) {
    res.status(400).send("Request needs post ID and author ID");
  }
  try {
    // remove post id from authorList of author
    await User.findOneAndUpdate(
      { _id: post.author },
      { $pull: { authorList: post._id } }
    ).exec();
    // remaove post from database
    await Post.deleteOne({ _id: post._id }).exec();
  } catch (e) {
    res.status(500).send("Error deleting post: ");
    return;
  }
  res.status(200).send({
    _id: post._id,
    msg: "Post Deletion Successful",
  });
  return;
});

/**
 * Endpoint to get posts
 * from a specified author
 */
postRouter.put("/getPostsBy", async (req, res) => {
  let { userID } = req.body;

  if (!userID) {
    res.status(400).send("You need to send in a user ID!");
    return;
  }

  let postsByUser = [];
  try {

    postsByUser = await Post.find({ author: userID }).exec();

    if (!postsByUser || postsByUser.length == 0) {
      res.status(400).send("This user has no posts.");
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occurred on the backend.");
    return;
  }

  res.status(200).send(postsByUser);
  return;
});

/**
 * Save a bookmark.
 */
postRouter.put('/bookmark', async (req, res) => {
  let { userID, postID } = req.body;

  if (!userID || !postID) {
    res.status(400).send('The request body was invalid!');
    return;
  }

  let user, post;
  try {

    user = await User.findById(userID).exec();
    post = await Post.findById(postID).exec();

    if (!user) {
      res.status(400).send('This user does not exist.');
      return;
    }

    if (!post) {
      res.status(400).send('This post does not exist.');
      return;
    }

    user.bookmarks.push(post);
    await user.save();
     
  } catch (e) {
    res.status(500).send('An error occured on the backend.');
    console.error(e);
    return;
  }

  res.status(200).send();
});

export { postRouter };
