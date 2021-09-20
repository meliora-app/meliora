import mongoose from 'mongoose';

const { SchemaTypes, Schema, model } = mongoose;

const PostSchema = new Schema({
	title: {
		type: SchemaTypes.String,
		required: true
	},
	timestamp: {
		type: SchemaTypes.Date,
		default: Date.now,
	},
	content: {
		type: SchemaTypes.String,
		required: true
	},
	author: {
		type: SchemaTypes.ObjectId,
		required: true
	}
});

const Post = new model('Post', PostSchema);

export { Post };