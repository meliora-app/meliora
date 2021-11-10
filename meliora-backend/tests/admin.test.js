import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import request from 'supertest';

import { Post } from '../src/models/Post.js';
import { User } from '../src/models/User.js';
import { server } from '../src/server.js';
import { connectToDB } from '../src/util/db.js';

describe('Unit Tests for Admin Functionality', () => {
	let testAdminID;

	beforeAll(async () => {
		await connectToDB(process.env.TEST_DB_STRING);
	});

	test('SP-2, US-16: Server should respond with 400 if the user does not exist when trying to create an admin.', async () => {
		let res = await request(server)
			.put('/admin/')
			.set('Content-Type', 'application/json')
			.send({
				userID: '61778675c9d1462e68c111dc'
			});

		expect(res.status).toBe(400);
	});

	test('SP-2, US-16: Server should respond with 200 when a valid user ID is provided, admin status should be set to true.', async () => {
		let res = await request(server)
			.put('/admin/')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_USER_ID
			});
		
		expect(res.status).toBe(200);
	});

	test('SP-2, US-16: Server should respond with 200 again, admin status should toggle back to false.', async () => {
		await request(server)
			.put('/admin/')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_USER_ID
			});
		
		let user = await User.findById(process.env.TEST_USER_ID).exec();

		expect(user.admin).toBe(false);
	});

	test('SP-2, US-16: Server should respond with 200 if server is up. List should be empty.', async () => {
		let res = await request(server)
			.get('/admin/review');
		expect(res.status).toBe(200);
	});

	test('SP-2, US-16: Upon manual setting of flags on an existing test post, server should return 200 and a populated list.', async () => {
		let post = await Post.findById(process.env.TEST_POST_ID).exec();
		post.flags = 10;
		post.delinquent = true;
		await post.save();

		let res = await request(server)
			.get('/admin/review');
		
		expect(res.body.length).toBe(1);
	});

	test('SP-2, US-16: Server should respond with 400 if request body is invalid.', async () => {
		let res = await request(server)
			.put('/admin/eval')
			.set('Content-Type', 'application/json')
			.send({
				decision: true
			});
		
		expect(res.status).toBe(400);
	});

	test('SP-2, US-16: Server should respond with 200 even if post does not exist.', async () => {
		let res = await request(server)
			.put('/admin/eval')
			.set('Content-Type', 'application/json')
			.send({
				postID: process.env.TEST_BOGUS_POST_ID,
				decision: true
			});
		
		expect(res.status).toBe(200);
	});

	test('SP-2, US-16: Server should respond with 200 when provided valid request body.', async () => {
		let res = await request(server)
			.put('/admin/eval')
			.set('Content-Type', 'application/json')
			.send({
				postID: process.env.TEST_POST_ID,
				decision: false
			});
		
		expect(res.status).toBe(200);
	});

	afterAll(async () => {
		await disconnect();
	});

});