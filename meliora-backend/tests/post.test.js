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
				anonymous: true,
				hidden: false,
				category: process.env.TEST_CAT_ID
			});

		let status = res.status;

		res = await Post.findOne({ title: 'Test2 Title' }).exec();

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
			.put(`/api/posts/getPostsBy`);

		expect(res.status).toBe(400);
	});

	test('Get Posts By User: Server should return 200 when an ID is provided.', async () => {
		let res = await request(server)
			.put(`/api/posts/getPostsBy`)
			.set('Content-Type', 'application/json')
			.send({
				userID: '61552c5957d8965194069d8a',
			});

		expect(res.status).toBe(200);
	});

	test('SP-2, US-2: Post Created Earlier should have default reaction counts of 0.', async () => {
		let post = await Post.findById(testPostID).exec();

		let sum = post.reactions.hearts + post.reactions.thumbs + post.reactions.hugs + post.reactions.smileys;

		expect(sum).toBe(0);
	});

	test('SP-2, US-2: We should see an updated count when reacting to a post.', async () => {
		await request(server)
			.put('/api/posts/react')
			.set('Content-Type', 'application/json')
			.send({
				postID: testPostID,
				reaction: 0
			});

		let post = await Post.findById(testPostID).exec();

		expect(post.reactions.hearts).toBe(1);
	});

	test('SP-2, US-3:', async () => {});

	test('SP-2, US-3:', async () => {});

	test('SP-2, US-4:', async () => {});

	test('SP-2, US-4:', async () => {});

	test('SP-2, US-5:', async () => {});

	test('SP-2, US-5:', async () => {});

	test('SP-2, US-6:', async () => {});

	test('SP-2, US-6: Server should respond with 400 when the post does not exist.', async () => {
		let res = await request(server)
			.put('/api/posts/bookmark')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_USER_ID,
				postID: process.env.TEST_BOGUS_POST_ID
			});
		
		expect(res.status).toBe(400);
	});

	test('SP-2, US-9:', async () => {});

	test('SP-2, US-9:', async () => {});

	test('SP-2, US-10:', async () => {});

	test('SP-2, US-10:', async () => {});

	test('SP-2, US-13:', async () => {});

	test('SP-2, US-13:', async () => {});

	test('SP-2, US-14:', async () => {});

	test('SP-2, US-14:', async () => {});

	test('SP-2, US-15:', async () => {});

	test('SP-2, US-15:', async () => {});

	afterAll(async () => {
		await Post.deleteMany({title: 'Test2 Title'});
		await disconnect();
	})
});