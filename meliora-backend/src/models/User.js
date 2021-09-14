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
	}
});

const User = new model('User', UserSchema);

export { User, UserSchema };