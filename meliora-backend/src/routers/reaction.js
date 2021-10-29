import { Router } from "express";
import { Reaction } from "../models/Reaction.js";
import { Post } from "../models/Post.js";

const reactionRouter = Router();

reactionRouter.post("/add", async (req, res) => {
  var reactionData = req.body;
  if (!isValidReaction(reactionData)) {
    res
      .status(400)
      .send(
        "Reaction data is missing important information or has incorrect information."
      );
    return;
  }

  try {
    const postData = await Post.findById(reactionData.postID).exec();
    const existingData = Reaction.findOne({
      $and: [
        { profileID: reactionData.profileID },
        { postID: reactionData.postID },
      ],
    }).exec();

    if (existingData) {
      const currReaction = existingData.reaction;
      if (currReaction === "heart") {
        postData.reactions.heart = postData.reactions.heart - 1;
      } else if (currReaction === "thumbsUp") {
        postData.reactions.thumbs = postData.reactions.thumbs - 1;
      } else if (currReaction === "smiley") {
        postData.reactions.smileys = postData.reactions.smileys - 1;
      } else {
        postData.reactions.hugs = postData.reactions.hugs - 1;
      }

      existingData.reaction = reactionData.reaction;
      existingData.creationDate = Date.now();
      existingData.save();
    } else {
      const reaction = new Reaction(reactionData);

      await reaction.save();
    }

    if (reactionData.reaction === "heart") {
      postData.reactions.heart = postData.reactions.heart + 1;
    } else if (reactionData.reaction === "thumbsUp") {
      postData.reactions.thumbs = postData.reactions.thumbs + 1;
    } else if (reactionData.reaction === "smiley") {
      postData.reactions.smileys = postData.reactions.smileys + 1;
    } else {
      postData.reactions.hugs = postData.reactions.hugs + 1;
    }
    await postData.save();
    res.status(200).send("Reaction added successfully!");
  } catch (err) {
    res.status(500).send("Database error: ", err);
  }
});

const isValidReaction = (reactionData) => {
  return (
    "reaction" in reactionData &&
    (reactionData.reaction === "heart" ||
      reactionData.reaction === "thumbsUp" ||
      reactionData.reaction === "smiley" ||
      reactionData.reaction === "hug") &&
    "profileID" in reactionData &&
    "postID" in reactionData
  );
};

export { reactionRouter };
