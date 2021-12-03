import 'regenerator-runtime/runtime';

import { disconnect } from 'mongoose';
import request from 'supertest';

import { Notification } from '../src/models/Notification.js';
import { notifyUserFollow, notifyUserReact, notfiyUserComment, notfiyWatchlistReact, notifyWatchlistComment } from '../src/util/notificationUtil.js';
import { server } from '../src/server.js';
import { connectToDB } from '../src/util/db.js';

describe('Unit Tests for Notification Functionality', () => {

	beforeAll(async () => {
		await connectToDB(process.env.TEST_DB_STRING);
	});

	test('SP-3, US-1: Notifications Inbox for User A should have one message when User B follows them.', async () => {
		await request(server)
			.put('/api/users/follow')
			.set('Content-Type', 'application/json')
			.send({
				followerID: process.env.TEST_USER_ID_2,
				followedID: process.env.TEST_USER_ID
			});

		let res = await request(server)
			.put('/api/notifications/')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_USER_ID,
			});

		await request(server)
			.delete('/api/notifications/clear')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_USER_ID,
			});

		await request(server)
			.put('/api/users/unfollow')
			.set('Content-Type', 'application/json')
			.send({
				followerID: process.env.TEST_USER_ID_2,
				followedID: process.env.TEST_USER_ID
			});

		expect(res.body.length).toBe(1);
	});
	
	test('SP-3, US-1: Notification Query Route should return 500 when invalid user ID is provided', async () => {
		let res = await request(server)
			.put('/api/notifications/')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_BOGUS_USER_ID
			});
		
		expect(res.status).toBe(500);
	});

	test('SP-3, US-1: Notification Clear Route should return 500 when invalid user ID is provided', async () => {
		let res = await request(server)
			.delete('/api/notifications/clear')
			.set('Content-Type', 'application/json')
			.send({
				userID: process.env.TEST_BOGUS_USER_ID
			});
		
		expect(res.status).toBe(500);
	});

	test('SP-3, US-1: Notification Delete route should return 500 when an invalid notification ID is provided', async () => {
		let res = await request(server)
			.delete('/api/notifications/delete')
			.set('Content-Type', 'application/json')
			.send({
				notificationID: '4752839416789453041358970',
			});
		
		expect(res.status).toBe(500);
	});

	test('SP-3, US-1: Notification Query Route should return 400 when no user ID is provided', async () => {
		let res = await request(server)
			.put('/api/notifications/')
			.set('Content-Type', 'application/json')
			.send({});
		
		expect(res.status).toBe(400);
	});

	test('SP-3, US-1: Notification Clear Route should return 400 when no user ID is provided ', async () => {
		let res = await request(server)
			.delete('/api/notifications/clear')
			.set('Content-Type', 'application/json')
			.send({});
		
		expect(res.status).toBe(400);
	});

	test('SP-3, US-1: Notification Delete route should return 400 when no notification ID is provided', async () => {
		let res = await request(server)
			.delete('/api/notifications/delete')
			.set('Content-Type', 'application/json')
			.send({});
		
		expect(res.status).toBe(400);
	});

	test('SP-3, US-1: ', async () => {});


	afterAll(async () => {
		await disconnect();
	})

});