import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js';

const followNotificationBaseString = " has started following you!";

const reactNotificationBaseString = " has reacted to your post with a ";

const commentNotificationBaseString = " has commented on your post and said \"";

const watchlistReactBaseString = " has reacted to a post that engaged with, they sent a ";

const watchlistCommentBaseString = " has commented on a post that you engaged with, and said \"";

const FOLLOW = 0;
const REACT = 1;
const INTERACTION = 2;

const notifyUserFollow = async (sender, recipientID) => {
	let newNotif = {
		type: FOLLOW,
		text: sender.username + followNotificationBaseString,
		recipientID,
		senderID: sender._id
	};

	try {
		let user = await User.findById(recipientID).exec();

		if (user.notifcationPreference < 1)
			return;
		
		await new Notification(newNotif).save(); 
	}
	catch(e) { console.error(e); }
};

const notifyUserReact = async (sender, reaction, recipientID) => {
	let newNotif = {
		type: REACT,
		text: sender.username + reactNotificationBaseString + reaction + "!",
		recipientID,
		senderID: sender._id
	}

	try {
		let user = await User.findById(recipientID).exec();

		if (user.notifcationPreference < 2)
			return; 

		await new Notification(newNotif).save(); 
	}
	catch(e) { console.error(e); }
};

const notfiyUserComment = async (sender, commentText, recipientID) => {
	let newNotif = {
		type: INTERACTION,
		text: sender.username + commentNotificationBaseString + commentText + "\"",
		recipientID,
		senderID: sender._id
	}

	try {

		let user = await User.findById(recipientID).exec();

		if (user.notifcationPreference < 2)
			return;

		await new Notification(newNotif).save();	

	} catch (e) {
		console.error(e);
	}

};

const notfiyWatchlistReact = async (sender, watchlist, reaction) => {
	let newNotif = {
		type: INTERACTION,
		text: sender.username + watchlistReactBaseString + reaction + "!",
		recipientID: '',
		senderID: sender._id
	}

	try {

		watchlist.forEach(async (id) => {
			let user = await User.findById(id).exec();

			if (user.notifcationPreference < 3 || user._id == sender._id)
				return;

			newNotif.recipientID = id;

			await new Notification(newNotif).save();
		});

	} catch (e) {
		console.error(e);
	}

};

const notifyWatchlistComment = async (sender, commentText, watchlist) => {
	let newNotif = {
		type: INTERACTION,
		text: sender.username + watchlistCommentBaseString + commentText + "\"",
		recipientID: '',
		senderID: sender._id
	}

	try {

		watchlist.forEach(async (id) => {
			let user = await User.findById(id).exec();

			if (user.notifcationPreference < 3 || user._id == sender._id)
				return;

			newNotif.recipientID = id;

			await new Notification(newNotif).save();
		});

	} catch (e) {
		console.error(e);
	}
}

export {
	notifyUserFollow,
	notifyUserReact,
	notfiyUserComment,
	notfiyWatchlistReact,
	notifyWatchlistComment
};