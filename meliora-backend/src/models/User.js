import mongoose from 'mongoose';

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
	bio: {
		type: SchemaTypes.String,
		default: "",
	},
	darkModeStatus: {
		type: SchemaTypes.Boolean,
		default: false
	}
});

const User = new model('User', UserSchema);

export { User, UserSchema };