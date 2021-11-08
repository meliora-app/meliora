import { Notification } from '../models/Notification.js'

const followNotificationBaseString = " has started following you!";

const reactNotificationBaseString = " has reacted to your post with a ";

const FOLLOW = 0;
const REACT = 1;

const notifyUserFollow = async (username, recipientID) => {
	let newNotif = {
		type: FOLLOW,
		text: username + followNotificationBaseString,
		recipientID
	};

	try { await new Notification(newNotif).save(); }
	catch(e) { console.error(e); }
};

const notifyUserReact = async (username, reaction, recipientID) => {
	let newNotif = {
		type: REACT,
		text: username + reactNotificationBaseString + reaction + "!",
		recipientID
	}

	try { await new Notification(newNotif).save(); }
	catch(e) { console.error(e); }
};

export {
	notifyUserFollow,
	notifyUserReact
};