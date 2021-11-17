import mongoose from "mongoose";

const { SchemaTypes, Schema, model } = mongoose;

const NotificationSchema = new Schema({
	type: {
		type: SchemaTypes.Number,
		required: true
	},
	text: {
		type: SchemaTypes.String,
		required: true
	},
	sender: {
		type: SchemaTypes.ObjectId,
		required: true
	},
	recipient: {
		type: SchemaTypes.ObjectId,
		required: true
	},
	timestamp: {
		type: SchemaTypes.Date,
    	default: Date.now,
	}
});

const Notification = new model("Notification", NotificationSchema);

export { Notification };