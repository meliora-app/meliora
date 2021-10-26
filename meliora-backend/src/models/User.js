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
	}
});

const User = new model("User", UserSchema);

export { User, UserSchema };
