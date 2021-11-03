import mongoose from "mongoose";
import { UserSchema } from "./User.js";

const { SchemaTypes, Schema, model } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  description: {
    type: SchemaTypes.String,
    required: true,
  },
  followers: {
    type: [SchemaTypes.ObjectId],
    default: [],
  },
  posts: {
    type: [SchemaTypes.ObjectId],
    default: [],
  },
});

const Category = new model("Category", CategorySchema);

export { Category, CategorySchema };
