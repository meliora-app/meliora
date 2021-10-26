import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import request from 'supertest';

import { User } from '../src/models/User.js';
import { server } from '../src/server.js';
import { connectToDB } from '../src/util/db.js';

describe('Unit Tests for Admin Functionality', () => {
	let testAdminID;

	beforeAll(async () => {
		await connectToDB(process.env.TEST_DB_STRING);
	});

	test('SP-2, US-16: Server should respond with 400 if the user does not exist when trying to create an admin.', async () => {

	});

	test('SP-2, US-16: Server should respond with 200 when a valid user ID is provided, admin status should be set to true.', async () => {

	});

	test('SP-2, US-16: Server should respond with 200 again, admin status should toggle back to false.', async () => {

	});

	test('SP-2, US-16: Server should respond with 200 if server is up. List should be empty.', async () => {

	});

	test('SP-2, US-16: Upon manual setting of flags on an existing test post, server should return 200 and a populated list.', async () => {});

	test('SP-2, US-16: Server should respond with 400 if request body is invalid.', async () => {
		let res = await request(server)
			.put('/admin/eval')
			.set('Content-Type', 'application/json')
			.send({
				decision: true
			});
		
		expect(res.status).toBe(400);
	});

	test('SP-2, US-16: Server should respond with 500 if post does not exist.', async () => {
		let res = await request(server)
			.put('/admin/eval')
			.set('Content-Type', 'application/json')
			.send({
				postID: process.env.TEST_BOGUS_POST_ID,
				decision: true
			});
		
		expect(res.status).toBe(500);
	});

	test('SP-2, US-16: Server should respond with 200 when provided valid request body.', async () => {

	});

	afterAll(async () => {
		await disconnect();
	});

});