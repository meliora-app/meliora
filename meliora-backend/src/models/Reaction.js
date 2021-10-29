import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose;

const ReactionSchema = new Schema({
  reaction: {
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
  creationDate: {
    type: SchemaTypes.Date,
    default: Date.now(),
  },
});

const Reaction = new model("Reaction", ReactionSchema);

export { Reaction, ReactionSchema };
