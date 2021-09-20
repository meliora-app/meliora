import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import request from 'supertest';

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
				title: 'Test1 Title',
				content: 'Test1 Content'
			});
		
		expect(res.status).toBe(400);
	});

	test('Create: Server should return a 200 when a post is made with correct format', async () => {
		let res = await request(server)
			.post(`api/posts/create`)
			.set('Content-Type', 'application/json')
			.send({
				title: 'Test2 Title',
				content: 'Test2 Content',
				author: process.env.TEST_USER_ID
			});

		expect(res.status).toBe(200);
	});

	afterAll(done => {
		Post.deleteMany({});
		disconnect();

		done();
	})
});