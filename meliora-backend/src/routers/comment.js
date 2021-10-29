import { Router } from "express";
import { Comment } from "../models/Comment.js";

const commentRouter = Router();

export { commentRouter };

commentRouter.post("/add", (req, res) => {
  var commentData = req.body;
  if (!isValidComment(commentData)) {
    res
      .status(400)
      .send("The comment data does not have sufficient information!");
    return;
  }

  const comment = new Comment(commentData);
  comment
    .save()
    .then((result) => {
      res.status(200).send("Comment created successfully!");
    })
    .catch((err) => {
      res.status(500).send(`Database error: ${err}`);
    });
});

const isValidComment = (commentData) => {
  return (
    "comment" in commentData &&
    "profileID" in commentData &&
    "postID" in commentData
  );
};
