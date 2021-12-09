import { Router } from "express";
import { Reaction } from "../models/Reaction.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

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
    let user = await User.findById(reactionData.profileID).exec();
    user.eqPoints = (+user.eqPoints + 1).toString();
    const existingData = await Reaction.findOne({
      $and: [
        { profileID: reactionData.profileID },
        { postID: reactionData.postID },
      ],
    }).exec();

    if (existingData) {
      var currReaction;
      if (reactionData.flag === "REMOVE") {
        await Reaction.findOneAndDelete({
          $and: [
            { profileID: reactionData.profileID },
            { postID: reactionData.postID },
          ],
        }).exec();
        currReaction = reactionData.reaction;
      } else {
        currReaction = existingData.reaction;
      }

      if (currReaction === "heart") {
        postData.reactions.hearts = postData.reactions.hearts - 1;
      } else if (currReaction === "thumbsUp") {
        postData.reactions.thumbs = postData.reactions.thumbs - 1;
      } else if (currReaction === "smiley") {
        postData.reactions.smileys = postData.reactions.smileys - 1;
      } else {
        postData.reactions.hugs = postData.reactions.hugs - 1;
      }

      if (reactionData.flag === "REMOVE") {
        await postData.save();
        res.status(200).send("Reaction removed successfully!");
        return;
      }

      existingData.reaction = reactionData.reaction;
      existingData.creationDate = Date.now();
      existingData.save();
    } else {
      const reaction = new Reaction(reactionData);

      await reaction.save();
    }

    console.log(reactionData.reaction);
    console.log(postData.reactions);

    if (reactionData.reaction === "heart") {
      postData.reactions.hearts = postData.reactions.hearts + 1;
    } else if (reactionData.reaction === "thumbsUp") {
      postData.reactions.thumbs = postData.reactions.thumbs + 1;
    } else if (reactionData.reaction === "smiley") {
      postData.reactions.smileys = postData.reactions.smileys + 1;
    } else {
      postData.reactions.hugs = postData.reactions.hugs + 1;
    }
    await postData.save();
    await user.save();
    res.status(200).send("Reaction added successfully!");
  } catch (err) {
    res.status(500).send(`Database error: ${err}`);
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
    "postID" in reactionData &&
    "flag" in reactionData
  );
};

export { reactionRouter };
