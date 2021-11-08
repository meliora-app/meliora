import { Notification } from '../models/Notification.js'

const followNotificationBaseString = " has started following you!";

const reactNotificationBaseString = " has reacted to your post with a ";

const NotificationTypes = {
	FOLLOW: 0,
	REACTION: 1
};

const notifyUserFollow = async (username, recipientID) => {

};

const notifyUserReact = async (username, reaction, recipientID) => {

};

export {
	notifyUserFollow,
	notifyUserReact
};