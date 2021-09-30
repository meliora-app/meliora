import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import request from 'supertest';

import { Post } from '../src/models/Post.js';
import { server } from '../src/server.js';
import { connectToDB } from '../src/util/db.js';

describe('Unit Tests for Post Router:', () => {
	let testPostID;

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
			.post(`/api/posts/create`)
			.set('Content-Type', 'application/json')
			.send({
				title: 'Test2 Title',
				content: 'Test2 Content',
				author: process.env.TEST_USER_ID,
				anonymous: true
			});

		let status = res.status;

		res = await Post.findOne({ flags: 0 }).exec();

		testPostID = res._id;

		expect(status).toBe(200);
	});

	test('Flag: Server should return a 400 when trying to flag a post that doesn\'t exist', async () => {
		let res = await request(server)
			.patch(`/api/posts/flag`)
			.set('Content-Type', 'application/json')
			.send({
				post: process.env.TEST_BOGUS_POST_ID,
				flagger: process.env.TEST_USER_ID_2,
			});

		expect(res.status).toBe(400);
	});

	test('Flag: Server should return a 200 when flagging a post that exists', async () => {
		let res = await request(server)
			.patch(`/api/posts/flag`)
			.set('Content-Type', 'application/json')
			.send({
				post: testPostID,
				flagger: process.env.TEST_USER_ID_2,
			});

		expect(res.status).toBe(200);
	});

	test('Get All: Server should return 200 unless there is an issue with the server.', async () => {
		let res = await request(server)
			.get(`/api/posts/getAll`);
		
		expect(res.status).toBe(200);
	});

	test('Get Posts By User: Server should return 400 when no ID is provided.', async () => {
		let res = await request(server)
			.get(`/api/posts/getPostsBy`);

		expect(res.status).toBe(400);
	});

	test('Get Posts By User: Server should return 200 when an ID is provided.', async () => {
		let res = await request(server)
			.get(`/api/posts/getPostsBy`)
			.set('Content-Type', 'application/json')
			.send({
				userID: '61489001f5cbecf2074c5244',
			});

		expect(res.status).toBe(200);
	});

	afterAll(done => {
		Post.findByIdAndDelete(testPostID).exec();
		disconnect();

		done();
	})
});