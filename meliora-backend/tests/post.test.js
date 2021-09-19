import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import { request } from 'supertest';

import { Post } from '../src/models/Post.js';
import { server } from '../src/server.js';
import { connectToDB } from '../src/util/db.js';

describe('Unit Tests for Post Router:', () => {
	beforeAll(async () => {
		await connectToDB(process.env.TEST_DB_STRING);
	});

	test('Create: Server should return a 400 when a post is made with incorrect format', async () => {
		let res = await request(server)
			.post(`/api/posts/create`)
			.set('Content-Type', 'application/json')
			.send({
				title: 'Hi',
				content: 'Hi'
			});
		
		expect(res.status).toBe(400);
	});

	afterAll(async (done) => {
		await disconnect();

		done();
	})
});