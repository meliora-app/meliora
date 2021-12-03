import mongoose from "mongoose";
import { PostSchema } from "./Post.js";

const { SchemaTypes, Schema, model } = mongoose;

const UserSchema = new Schema({
	username: {
		type: SchemaTypes.String,
		required: true
	},
	name: {
		type: SchemaTypes.String,
		default: '',
	},
	phone: {
		type: SchemaTypes.String,
		default: '',
	},
	sex: {
		type: SchemaTypes.String,
		default: '',
	},
	email: {
		type: SchemaTypes.String,
		required: true
	},
	dateOfBirth: {
		type: SchemaTypes.String,
		default: '',
	},
	password: {
		type: SchemaTypes.String,
		required: true
	},
	authorList: {
		type: [SchemaTypes.ObjectId],
		default: [],
	},
	blocked: {
		type: [SchemaTypes.ObjectId],
		default: [],
	}, 
	following: {
		type: [SchemaTypes.ObjectId],
		default: []
	},
	followers: {
		type: [SchemaTypes.ObjectId],
		default: []
	},
	private: {
		type: SchemaTypes.Boolean,
		default: false,
	},
	admin: {
		type: SchemaTypes.Boolean,
		default: false,
	},
	bookmarks: {
		type: [PostSchema],
		default: []	
	},
	bio: {
		type: SchemaTypes.String,
		default: "",
	},
	darkModeStatus: {
		type: SchemaTypes.Boolean,
		default: false
	},
	notificationPreference: {
		type: SchemaTypes.Number,
		default: 3 // 0 for none, 1 for 'follows only,' 2 for 'my posts and follows,', 3 for 'my posts, follows, comments on posts I interact with'
	},
	shareURL: {
		type: SchemaTypes.String,
		required: false
	},
	eq: { /* Points earned for actions taken on app */
		type: SchemaTypes.Number,
		default: 0
	}
});

/**
 * Check for a bookmark
 */
UserSchema.methods.checkForBookmark = postID => {
	var i = 0;

	while (i < this.bookmarks.length) {
		if (this.bookmarks[i]._id == postID)
			return true;
	}

	return false;
};

/**
 * Remove a bookmark
 */
UserSchema.methods.removeBookmark = (postID) => {
	this.bookmarks.filter(post => {
		return post._id != postID;
	});
};

const User = new model("User", UserSchema);

export { User, UserSchema };