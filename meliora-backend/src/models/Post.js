import mongoose from 'mongoose';
import { UserSchema } from './User.js';

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
		type: UserSchema,
		required: true
	}
});

const Post = new model('Post', PostSchema);

export { Post };