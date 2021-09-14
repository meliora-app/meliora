import express from 'express';
import { config } from 'dotenv';
import { pingRouter } from './routers/ping.js';
import { postRouter } from './routers/post.js';

config();

let server = express();

server.use(express.json({
	limit: '50mb',
}));

server.use('/ping', pingRouter);
server.use('/api/posts', postRouter);

export { server };