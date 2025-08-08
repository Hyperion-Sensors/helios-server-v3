import request from 'supertest';
import app from '../../../index';

describe('Testing routes for general user settings ', () => {
	/*---------------------------------------------Get /latest------------------------------------------------- */
	describe('GET settings/general/user ', () => {
		// should respond with a 200 status code
		test('should respond with 200 status code', async () => {
			const response = await request(app)
				.get(
					`/helios-server/settings/general/user?sub=${process.env.TEST_USER_ID}`
				)
				.send();
			expect(response.statusCode).toBe(200);
		});
	});

	describe('GET settings/general/user ', () => {
		// should respond with a 204 status code
		test('should respond with 204 status code', async () => {
			const response = await request(app)
				.get(
					`/helios-server/settings/general/user?sub=0e0812d1-b165-45f6-bcdb-6fa312392861`
				)
				.send();
			expect(response.statusCode).toBe(204);
		});
	});

	describe('Patch settings/general/change-single/:id', () => {
		// should respond with a 200 status code
		test('should respond with 200 status code', async () => {
			const response = await request(app)
				.patch(
					`/helios-server/settings/general/change-single/${process.env.TEST_USER_ID}/general`
				)
				.send({Theme: 'light'});
			expect(response.statusCode).toBe(200);
		});

		//add more unit tests here
	});

	//add unit test for more routes here...
});
