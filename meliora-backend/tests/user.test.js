import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import request from 'supertest';

import { User } from '../src/models/User.js';
import { server } from '../src/server.js';
import { connectToDB } from '../src/util/db.js';

describe('Unit Tests for Post Router:', () => {
	let testUserID;

	beforeAll(async () => {
		await connectToDB(process.env.TEST_DB_STRING);
	});

	test('US-3: Server should return 400 when request body has incorrect format.', async () => {
		let res = await request(server)
			.post('/api/users/signup')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test User 3',
				password: 'gnsdnfjoinueasjionfoadmskaoiwjmda'
			});

		expect(res.status).toBe(400);
	});

	test('US-3: Server should return 200 when request body has correct format.', async () => {
		let res = await request(server)
			.post('/api/users/signup')
			.set('Content-Type', 'application/json')
			.send({
				email: 'test3@test.com',
				username: 'Test User 3',
				password: 'asdjjinfgsijgnijknsdfajnskdjak'
			});
		
		let status = res.status;

		res = await User.findOne({ authorList: [] }).exec();

		testUserID = res._id;

		expect(status).toBe(200);
	});

	test('US-4: Server should return 400 when body has no username', async () => {
		let res = await request(server)
			.put('/api/users/login')
			.set('Content-Type', 'application/json');

		expect(res.status).toBe(400);
	});

	test('US-4: Server should return 200 when a correct username is provided', async () => {
		let res = await request(server)
			.put('/api/users/login')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test User 1'
			});

		expect(res.status).toBe(200);
	});

	test('SP-2, US-11: Server should return 400 when invalid USER ID sent', async () => {
		let res = await request(server)
			.put('/api/users/block')
			.set('Content-Type', 'application/json')
			.send({
				blockerID: process.env.TEST_BOGUS_USER_ID,
				blockedID: process.env.TEST_BOGUS_USER_ID
			});

		expect(res.status).toBe(400);
	});

	test('SP-2, US-11: Server should return 200 when valid USER ID 1 blocks USER ID 2', async () => {
		let res = await request(server)
			.put('/api/users/block')
			.set('Content-Type', 'application/json')
			.send({
				blockerID: process.env.TEST_USER_ID,
				blockedID: process.env.TEST_USER_ID_2
			});

		expect(res.status).toBe(200);
	});

	test('SP-2, US-12: Server should return 400 when invalid USER ID sent', async () => {
		let res = await request(server)
			.put('/api/users/setPrivate')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_BOGUS_USER_ID,
			});

		expect(res.status).toBe(400);
	});

	test('SP-2, US-12: Server should return 200 when valid USER ID sent', async () => {
		let res = await request(server)
			.put('/api/users/setPrivate')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_USER_ID,
			});

		expect(res.status).toBe(200);
	});
	
	test('US-8: Server should return 200 when a correct username and a bio is provided', async () => {
		let res = await request(server)
			.post('/api/users/updateProfile')
			.set('Content-Type', 'application/json')
			.send({
				_id: process.env.TEST_USER_ID,
				bio: 'Test Bio'
			});

		expect(res.status).toBe(200);
	});

	test('US-8: Server should return 400 when no bio is provided', async () => {
		let res = await request(server)
			.post('/api/users/updateProfile')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test User 1'
			});

		expect(res.status).toBe(400);
	});

	afterAll(async () => {
		await User.findByIdAndDelete(testUserID).exec();
		await disconnect();
	})
});