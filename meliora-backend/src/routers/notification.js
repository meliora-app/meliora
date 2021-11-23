import { Router } from 'express';
import { Notification } from '../models/Notification.js';

const notificationRouter = new Router();

/**
 * Endpoint to get all notifications
 */
notificationRouter.put('/', async (req, res) => {
	let { userID } = req.body;

	if (!userID) {
		res.status(400).send('You must send in a user ID!');
		return;
	}

	let notifications = []
	try {

		notifications = await Notification.find({ recipient: userID }).exec();

	} catch (e) {
		console.error(e);
		res.status(500).send('An error occured on the backend');
		return;
	}

	res.status(200).send(notifications);
	return;
});

/**
 * Endpoint to dequeue a notification
 */
notificationRouter.delete('/delete', async (req, res) => {
	let { notificationID } = req.body;

	if (!notificationID) {
		res.status(400).send('You must send in a user ID!');
		return;
	}

	try {

		await Notification.findByIdAndDelete(notificationID).exec();

	} catch (e) {
		console.error(e);
		res.status(500).send('An error occured on the backend');
		return;
	}

	res.status(200).send(true);
	return;
});

/**
 * Endpoint to clear notifications
 */
notificationRouter.delete('/clear', async (req, res) => {
	let { userID } = req.body;

	if (!userID) {
		res.status(400).send('You must send in a user ID!');
		return;
	}

	try {

		await Notification.deleteMany({ recipient: userID }).exec();

	} catch (e) {
		console.error(e);
		res.status(500).send('An error occured on the backend');
		return;
	}

	res.status(200).send(true);
	return;
});

export { notificationRouter };