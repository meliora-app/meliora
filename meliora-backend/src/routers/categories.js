import { Router } from "express";
import { Category } from "../models/Category.js";
import { Post } from "../models/Post.js";
import { Reaction } from "../models/Reaction.js";

const catRouter = Router();

catRouter.post("/create", async (req, res) => {
  var category = req.body;
  if (!isValidCategory(category)) {
    res.status(400).send("The object structure of this category is invalid!");
    return;
  }

  var categoryDoc;
  try {
    categoryDoc = await new Category(category).save();
  } catch (err) {
    res.status(500).send(`Backend error`);
    console.log(err);
    return;
  }

  res.status(200).send("Category created successfully!");
});

catRouter.get("/getAll", (req, res) => {
  Category.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send("Backend err");
    });
});

catRouter.get("/getById", async (req, res) => {
  var id = req.query.id;
  var posts = [];
  try {
    var category = await Category.findById(id).exec();
    for (var i = 0; i < category.posts.length; i++) {
      var postData = await Post.findById(category.posts[i]).exec();
      posts.push(postData);
    }
    var data = {
      categoryData: category,
      posts: posts,
    };
    // category.posts = posts;
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(`Database error: ${err}`);
  }
});

catRouter.post("/manageFollower", async (req, res) => {
  var userID = req.body.userID;
  var categoryID = req.body.categoryID;
  try {
    var category = await Category.findById(categoryID).exec();
    var followersList = category.followers.map((follower) =>
      follower.toString()
    );
    if (followersList.includes(userID)) {
      var followerIndex = category.followers.findIndex(
        (followerID) => followerID.toString() === userID
      );
      category.followers.splice(followerIndex, 1);
    } else {
      category.followers.push(userID);
    }

    await category.save();
    res.status(200).send("Follower information managed successfully!");
  } catch (err) {
    res.status(500).send(`Database error: ${err}`);
  }
});

catRouter.get("/getTrending", async (req, res) => {
  var totalEngagements = [];

  var currDate = new Date();
  currDate.setHours(currDate.getHours() - 3);

  try {
    const categories = await Category.find({});
    for (var i = 0; i < categories.length; i++) {
      var posts = categories[i]["posts"];
      var sum = 0;
      for (var j = 0; j < posts.length; j++) {
        var recentEngagements = [];
        recentEngagements = await Reaction.find({
          $and: [{ postID: posts[j] }, { creationDate: { $gt: currDate } }],
        })
          .maxTime(3000)
          .exec();

        sum += recentEngagements.length;
      }

      totalEngagements.push({ category: categories[i], count: sum });
    }

    totalEngagements = totalEngagements.sort((a, b) => b.count - a.count);

    res.status(200).send(totalEngagements.slice(0, 2));
  } catch (err) {
    res.status(500).send(`Database error: ${err}`);
  }
});

catRouter.get("/getPostsByCatFol", async (req, res) => {
  var posts = [];
  var userID = req.query.userID;

  if (!userID) {
    return res.status(400).send("Please pass a valid userID as query param.");
  }

  try {
    var categories = await Category.find({}).exec();
    for (var i = 0; i < categories.length; i++) {
      var followers = categories[i].followers;
      // console.log(followers.includes(userID));
      // console.log(followers);
      if (followers.includes(userID)) {
        var catPosts = categories[i].posts;
        // console.log(catPosts);
        for (var j = 0; j < catPosts.length; j++) {
          var post = await Post.findOne({ _id: catPosts[j] });
          // console.log(catPosts[j].toString);
          posts.push(post);
        }
      }
    }

    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send(err);
  }
});

//helpers
const isValidCategory = (category) => {
  return (
    "name" in category && "description" in category && "creator" in category
  );
};

export { catRouter };
