import { Router } from "express";
import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
<<<<<<< HEAD
import { notfiyUserComment, notfiyWatchlistComment } from "../util/notificationUtil.js";
=======
import { notfiyUserComment, notifyWatchlistComment } from "../util/notificationUtil.js";
>>>>>>> 0a2e3b9ddf6fea653c869498e151af75d9fcfb81

const commentRouter = Router();

export { commentRouter };

commentRouter.post("/add", async (req, res) => {
  var commentData = req.body;
  if (!isValidComment(commentData)) {
    res
      .status(400)
      .send("The comment data does not have sufficient information!");
    return;
  }

  try {
    await new Comment(commentData).save();

    
    const user = await User.findById(commentData.profileId).exec();
    user.eq = user.eq + 3;

    notfiyUserComment(user, commentData.comment, await Post.findById(commentData.postID).exec().author);
    notfiyWatchlistComment(user, commentData.comment, await Post.findById(commentData.postID).exec().watchlist);

    await user.save();
  } catch (e) {
    res.status(500).send(`Database error: ${err}`);
    return;
  }

  res.status(200).send("Comment created successfully!");
});

commentRouter.put("/getComments", async (req, res) => {
  let { id } = req.body;

  if (!id) {
    res.status(400).send("You need to send in a post ID!");
    return;
  }

  let comments = [];
  try {
    comments = await Comment.find({ postID: id }).exec();

    if (!comments || comments.length == 0) {
      res.status(200).send("This post has no comments.");
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occurred on the backend.");
    return;
  }

  res.status(200).send(comments);
  return;

});

commentRouter.delete("/deleteComment", async (req, res) => {
  let commentID = req.body.commentID;

  if (!commentID) {
    res.status(400).send("Request needs comment ID");
  }
  try {
    // remove comment from database
    await Comment.deleteOne({ _id: commentID }).exec();
  } catch (e) {
    res.status(500).send("Error deleting comment: ");
    return;
  }
  res.status(200).send({
    _id: commentID,
    msg: "Comment Deletion Successful",
  });
  return;
});

const isValidComment = (commentData) => {
  return (
    "comment" in commentData &&
    "profileID" in commentData &&
    "postID" in commentData
  );
};
