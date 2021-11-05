import mongoose from 'mongoose';

const { SchemaTypes, Schema, model } = mongoose;

const UserSchema = new Schema({
	username: {
		type: SchemaTypes.String,
		required: true
	},
	email: {
		type: SchemaTypes.String,
		required: true
	},
	password: {
		type: SchemaTypes.String,
		required: true
	},
	authorList: {
		type: [SchemaTypes.ObjectId],
		default: [],
	},
	bio: {
		type: SchemaTypes.String,
		default: ""
	},
	darkModeStatus: {
		type: SchemaTypes.Boolean,
		default: false
	}
});

const User = new model('User', UserSchema);

export { User, UserSchema };