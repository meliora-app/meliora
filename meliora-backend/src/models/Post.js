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
	},
	authorName: {
		type: SchemaTypes.String,
		default: '',
	},
	flags: {
		type: SchemaTypes.Number,
		default: 0,
	},
	delinquent: {
		type: SchemaTypes.Boolean,
		default: false,
	},
	anonymous: {
		type: SchemaTypes.Boolean,
		required: true,
	},
	reactions: {
		hearts: {
			type: SchemaTypes.Number,
			default: 0
		},
		thumbs: {
			type: SchemaTypes.Number,
			default: 0
		},
		smileys: {
			type: SchemaTypes.Number,
			default: 0
		},
		hugs: {
			type: SchemaTypes.Number,
			default: 0
		}
	}
});

const Post = new model('Post', PostSchema);

export { Post };