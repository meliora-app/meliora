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

	test('US-4: Server should return 400 when request body has incorrect format.', async () => {
		let res = await request(server)
			.post('/api/users/signup')
			.set('Content-Type', 'application/json')
			.send({
				username: 'Test User 3',
				password: 'gnsdnfjoinueasjionfoadmskaoiwjmda'
			});

		expect(res.status).toBe(400);
	});

	test('US-4: Server should return 200 when request body has correct format.', async () => {
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

		expect(status).toBe(200);
	});

	afterAll(done => {
		User.findByIdAndDelete(testUserID).exec();
		disconnect();

		done();
	})
});