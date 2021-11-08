import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import request from 'supertest';

import { Notification } from '../src/models/Notification.js';
import { notifyUserFollow, notifyUserReact } from '../src/util/notificationUtil.js';
import { server } from '../src/server.js';
import { connectToDB } from '../src/util/db.js';

describe('Unit Tests for Notification Functionality', () => {

	beforeAll(async () => {
		await connectToDB(process.env.TEST_DB_STRING);
	});

	test('SP-3, US-1: ', async () => {});
	
	test('SP-3, US-1: ', async () => {});

	test('SP-3, US-1: ', async () => {});

	test('SP-3, US-1: ', async () => {});

	test('SP-3, US-1: ', async () => {});

	test('SP-3, US-1: ', async () => {});

	test('SP-3, US-1: ', async () => {});

	test('SP-3, US-1: ', async () => {});


	afterAll(async () => {
		await disconnect();
	})

});