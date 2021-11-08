import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import request from 'supertest';

import { User } from '../src/models/User.js';
import { server } from '../src/server.js';
import { connectToDB } from '../src/util/db.js';

describe('Unit Tests for Comment Functionality', () => {

	beforeAll(async () => {
		await connectToDB(process.env.TEST_DB_STRING);
	});

	test('SP-2, US-7: Server should return 400 when incorrect request body is sent.', async () => {});

	test('SP-2, US-7: Server should return 200 when correct request body has been provided.', async () => {});

	afterAll(async () => {
		await disconnect();
	});

});