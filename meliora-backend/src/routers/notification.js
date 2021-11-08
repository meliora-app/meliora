import { Router } from 'express';

const notificationRouter = new Router();

/**
 * Endpoint to get all notifications
 */
notificationRouter.get('/', async (req, res) => {

});

/**
 * Endpoint to dequeue a notification
 */
notificationRouter.delete('/delete', async (req, res) => {

});

/**
 * Endpoint to clear notifications
 */
notificationRouter.delete('/clear', async (req, res) => {
	
});

export { notificationRouter };