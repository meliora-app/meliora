import { Router } from "express";

import { User } from "../models/User.js";

import { Post } from "../models/Post.js";

import { notifyUserFollow } from "../util/notificationUtil.js";

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

  if (!user || (!user.username && !user.email)) {
    res.status(400).send("You must send in the username or email!");
    return;
  }

  let userDoc;
  try {
    userDoc = await User.findOne({
      $or: [{ username: user.username }, { email: user.email }],
    }).exec();

    if (!userDoc) {
      res.status(400).send("This user does not exist!");
      return;
    }

    userDoc.checkUndefined();

    await userDoc.save();
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
    /*
    userDocument = await User.findOne({
      $or: [{ _id: user._id }, { username: user.username }],
    }).exec();
    */

    userDocument = await User.findById(user._id).exec();
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
 * Load up a user profile
 */
userRouter.put("/getUserProfile", async (req, res) => {

  let { userID } = req.body;

  if (!userID) {
    res.status(400).send('You must send in a user ID!');
    return;
  }

  let completeUserProfile = {};
  try {

    let user = await User.findById(userID).exec();

    if (!user) {
      res.status(400).send('This user does not exist!');
      return;
    }

    let posts = await Post.find({ author: userID }).exec();

    completeUserProfile = user;
    completeUserProfile.posts = posts;
    completeUserProfile.numPosts = posts.length;

  } catch (e) {
    console.error(e);
    res.status(500).send('There was an error on the backend.');
    return;
  }

  res.status(200).send(completeUserProfile);
});

/**
 * Update user settings after editing
 * Update using _id
 * Garrett Lee
 */
userRouter.post("/updateSettings", async (req, res) => {
  let user = req.body;

  if (!user._id) {
    res.status(400).send("Request needs a userID");
  }

  let userDoc;
  try {
    userDoc = await User.findById(user._id).exec();
    
    if (!userDoc) {
      res.status(500).send("Error finding user with ID: " + user._id);
    }
    if (user.darkModeStatus) userDoc.darkModeStatus = user.darkModeStatus;
    if (user.sex) userDoc.sex = user.sex;
    if (user.dateOfBirth) userDoc.dateOfBirth = user.dateOfBirth;
    if (user.name) userDoc.name = user.name;
    if (user.phone) userDoc.phone = user.phone;
    await userDoc.save();

  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching and updating user");
  }

  res.status(200).send("Successful update");

});

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

  /*
  res.status(200).send({
    _id: userDoc._id,
    username: userDoc.username,
    bio: userDoc.bio,
    darkModeStatus: userDoc.darkModeStatus,
    authorList: userDoc.authorList,
    email: userDoc.email,
    phone: userDoc.phone,
    sex: userDoc.sex,
    name: userDoc.name,
    dateOfBirth: userDoc.dateOfBirth
  });
  */
 res.status(200).send(userDoc);
});

/**
 * Endpoint to delete account/all posts and references
 * delete account with _id
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

/**
 * Follow a user
 */
userRouter.put('/follow', async (req, res) => {
  let { followerID, followedID } = req.body;

  if (!followerID || !followedID) {
    res.status(400).send('Request body has incorrect format!');
    return;
  }

  try {

    let followingUser = await User.findById(followerID).exec();
    let followedUser = await User.findById(followedID).exec();
    
    if (!followingUser.following)
      followingUser.following = [];

    if (!followedUser.followers) {
      followedUser.followers = [];
    }

    // ensure no duplicates in following
    if (!followingUser.following.includes(followedID)) {
      followingUser.following.push(followedID);
    }

    //ensure no duplicates in followers
    if (!followedUser.followers.includes(followerID)) {
      followedUser.followers.push(followerID);
    }

    await followingUser.save();
    await followedUser.save();

    notifyUserFollow(followingUser, followedID);
  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend.');
    return;
  }

  res.status(200).send(true);
});

/**
 * Unfollow a user
 */
 userRouter.put('/unfollow', async (req, res) => {
  let { followerID, followedID } = req.body;

  if (!followerID || !followedID) {
    res.status(400).send('Request body has incorrect format!');
    return;
  }

  try {

    let followingUser = await User.findById(followerID).exec();
    let followedUser = await User.findById(followedID).exec();
    
    if (!followingUser.following)
      followingUser.following = [];

    if (!followedUser.followers) {
      followedUser.followers = [];
    }

    // ensure exists in following
    if (followingUser.following.includes(followedID)) {
      await User.findOneAndUpdate(
        { _id: followerID },
        { $pull: { following: followedID } }
      ).exec();
    }

    //ensure exists in followers
    if (followedUser.followers.includes(followerID)) {
      await User.findOneAndUpdate(
        { _id:followedID },
        { $pull: { followers: followerID } }
      ).exec();
    }

    await followingUser.save();
    await followedUser.save();
  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend.');
    return;
  }

  res.status(200).send(true);
});

/* 
* Block a user
*/
userRouter.put('/block', async (req, res) => {
  let { blockerID, blockedID } = req.body;

  if (!blockerID || !blockedID) {
    res.status(400).send('Request body has incorrect format!');
    return;
  }

  try {

    let blockingUser = await User.findById(blockerID).exec();
    
    if (!blockingUser.blocked)
      blockingUser.blocked = [];

    if (blockingUser.blocked.includes(blockedID)) {
      blockingUser.blocked = blockingUser.blocked.filter((thisUser) => {
        return thisUser != blockedID;
      });
    } else {
      blockingUser.blocked.push(blockedID);
    }

    await blockingUser.save();
  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend.');
    return;
  }

  res.status(200).send(true);
});

/**
 * Set a User's Privacy Preference
 */
userRouter.put('/setPrivate', async (req, res) => {

  let { userID } = req.body;

  if (!userID) {
    res.status(400).send('You must send in a user ID!');
    return;
  }

  try {

    let user = await User.findById(userID).exec();

    user.private = (!("private" in user) || !user.private);

    await user.save();

  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend.');
    return;
  }

  res.status(200).send(true);
  return;
});

/**
 * Update Notification Preferences
 */
userRouter.put('/setNotifications', async (req, res) => {
  let { userID, preference } = req.body;

  if (!userID || !preference) {
    res.status(400).send('You must send in a user ID and a preference!');
    return;
  }

  try {

    let user = await User.findById(userID).exec();
    user.notifcationPreference = preference;
    await user.save();

  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend!');
    return;
  }

  res.status(200).send(true);
});

/**
 * Route to generate and save unique URL
 */
userRouter.put('/share', async (req, res) => {
  let { userID } = req.body;

  if (!userID) {
    res.status(400).send('You must send in a userID!');
    return;
  }
  
  let user;
  try {

    user = await User.findById(userID).exec();

  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend.');
    return;
  }

  res.status(200).send(user.shareURL);
});

/**
 * Update sort preference
 */
 userRouter.put('/sortPreference', async (req, res) => {
  let { userID, newSortPreference } = req.body;

  if (!userID) {
    res.status(400).send('You must send in a userID!');
    return;
  }
  
  let user;
  try {

    user = await User.findById(userID).exec();
    user.sortPreference = newSortPreference;
    await user.save();

  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend: ' + e);
    return;
  }

  res.status(200).send(user.sortPreference);
});

/**
 * Return search suggestions
 */
 userRouter.put('/searchSuggestion', async (req, res) => {
  let input  = req.body.input;

  if (!input) {
    res.status(400).send('Invalid search, you must send in input');
    return;
  }
  
  let searchResults;
  try {
    searchResults = await User.find({ username: {$regex : new RegExp("^" + input), $options:'i'}}).clone();

  } catch (e) {
    console.error(e);
    res.status(500).send('An error occured on the backend: ' + e);
    return;
  }

  res.status(200).send(searchResults);
});

export { userRouter };
