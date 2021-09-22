import express from 'express';
import { config } from 'dotenv';
import { pingRouter } from './routers/ping.js';
import { postRouter } from './routers/post.js';
import { userRouter } from './routers/user.js';
import { decodeIDToken } from './util/decodeIDToken.js';

config();

let server = express();

server.use(express.json({
	limit: '50mb',
}));

server.use(decodeIDToken);

server.use('/ping', pingRouter);
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

export { server };