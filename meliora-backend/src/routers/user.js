import { Router } from "express";

import { User } from "../models/User.js";

import { Post } from "../models/Post.js";

const userRouter = Router();

/**
 * Util func to make sure input is correct format
 */
const isValidUser = (user) => {
  return user.email && user.username && user.password;
};

/**
 * Signup
 */
userRouter.post("/signup", async (req, res) => {
  let user = req.body;

  if (!isValidUser(user)) {
    res.status(400).send("The object structure of this user was invalid!");
    return;
  }

  let userDoc;

  try {
    userDoc = await User.findOne({ username: user.username }).exec();

    if (userDoc) {
      res.status(400).send("This username is taken!");
      return;
    }

    userDoc = await new User(user).save();
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occured on the backend.");
    return;
  }

  res.status(200).send({
    _id: userDoc._id,
    msg: "User signup successful!",
  });
});

/**
 * Login
 */
userRouter.put("/login", async (req, res) => {
  let user = req.body;

  if (!user || !user.username) {
    res.status(400).send("You must send in the username!");
    return;
  }

  let userDoc;
  try {
    userDoc = await User.findOne({ username: user.username }).exec();

    if (!userDoc) {
      res.status(400).send("This user does not exist!");
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("An error occurred on the backend.");
    return;
  }

  res.status(200).send({
    _id: userDoc._id,
    darkModeStatus: userDoc.darkModeStatus,
  });
});

/**
 * Update user profile after editing
 * Update with either username or _id
 * Garrett Lee
 */
userRouter.post("/updateProfile", async (req, res) => {
  let user = req.body;

  if ((!user.username && !user._id) || !user.bio) {
    res.status(400).send("Bad request. Include bio and userID/username");
    return;
  }
  let userDocument;

  try {
    userDocument = await User.findOne({
      $or: [{ _id: user._id }, { username: user.username }],
    }).exec();
    if (!userDocument) {
      res.status(500).send("User not found");
      return;
    }
    userDocument.bio = user.bio;
    userDocument.save();
  } catch (e) {
    console.error(e);
    res.status(400).send("Error updating user");
    return;
  }

  res.status(200).send({
    _id: userDocument._id,
    username: userDocument.username,
    bio: userDocument.bio,
    darkModeStatus: userDocument.darkModeStatus,
    authorList: userDocument.authorList,
  });
});

/**
 * Update user settings after editing
 * Update using _id
 * Garrett Lee
 */
userRouter.post("updateSettings", async (req, res) => { });

/**
 * Retrieve user information
 * retrieve with either username or _id
 * Garrett Lee
 */
userRouter.put("/getUser", async (req, res) => {
  let user = req.body;

  if (!user._id && !user.username && !user.email) {
    res.status(400).send("Must request user with id or username");
    return;
  }

  let userDoc;

  try {
    // search by id, username or email for now
    userDoc = await User.findOne({
      $or: [
        { _id: user._id },
        { username: user.username },
        { email: user.email },
      ],
    }).exec();

    if (!userDoc) {
      res.status(500).send("User not found in database");
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching user");
  }

  res.status(200).send({
    _id: userDoc._id,
    username: userDoc.username,
    bio: userDoc.bio,
    darkModeStatus: userDoc.darkModeStatus,
    authorList: userDoc.authorList,
    email: userDoc.email
  });
});

/**
 * Endpoint to delete account/all posts and references
 * delete account with _id
 * TODO: Also needs to delete from firebase... Frontend?
 * Garrett Lee
 */
userRouter.delete("/deleteAccount", async (req, res) => {
  let user = req.body;
  // delete all posts with user as author
  Post.deleteMany({ author: user._id }, function (err) {
    if (err) {
      res.status(500).send("Error deleting user's posts: " + err);
      console.log("Post deletion failure: " + err);
      return;
    } else {
      console.log("User's posts deletion successful");
    }
  });

  // delete account
  User.deleteOne({ _id: user._id }, function (err) {
    if (err) {
      res.status(500).send("Error deleting user: " + err);
      console.log(err);
      return;
    } else {
      console.log("Account Delete Successful");
    }
  });

  res.status(200).send({
    _id: user._id,
    msg: "Account Deletion Successful or user not found",
  });
});

export { userRouter };
