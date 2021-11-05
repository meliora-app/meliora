import { Router } from 'express';

const pingRouter = new Router();

pingRouter.get('/', (req, res) => {
	res.status(200).send('pong.');
})

export { pingRouter };