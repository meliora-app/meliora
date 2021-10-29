import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose;

const CommentSchema = new Schema({
  comment: {
    type: SchemaTypes.String,
    required: true,
  },
  profileID: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  postID: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  likes: {
    type: SchemaTypes.Number,
    default: 0,
  },
});

const Comment = new model("Comment", CommentSchema);

export { Comment, CommentSchema };
