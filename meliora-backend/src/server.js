import express from 'express';
import { config } from 'dotenv';

config();

let server = express();

server.use(express.json({
	limit: '50mb',
}));

export { server };