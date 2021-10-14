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

	test('SP-2, US-7:', async () => {});

	test('SP-2, US-7:', async () => {});

	afterAll(async () => {
		await disconnect();
	});

});