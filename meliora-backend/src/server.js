import express from 'express';
import { config } from 'dotenv';
import { pingRouter } from './routers/ping.js';
import { postRouter } from './routers/post.js';
import { userRouter } from './routers/user.js';
import { decodeIDToken } from './util/decodeIDToken.js';
import cors from 'cors';

config();

let server = express();

server.use(express.json({
	limit: '50mb',
}));

server.use(cors({
	origin: '*',
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

server.use(decodeIDToken);

server.use('/ping', pingRouter);
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

export { server };