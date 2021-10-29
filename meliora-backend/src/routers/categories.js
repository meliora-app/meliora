import { Router } from "express";
import { Category } from "../models/Category.js";
import { Post } from "../models/Post.js";

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

catRouter.get("/getTrending", async (req, res) => {
  const categories = await Category.find({});
  var totalEngagements = new Array(category.length).fill(0);

  for (var i = 0; i < categories.length; i++) {
    var posts = categories[i]["posts"];
    var sum = 0;
    var post = await Post.findById(posts[0]);
    console.log(post);
  }
});

//helpers
const isValidCategory = (category) => {
  return "name" in category && "description" in category;
};

export { catRouter };
