import request from 'supertest';
import app from '../../index';

describe('Testing routes for temperature data: ', () => {
	/*---------------------------------------------Get /latest------------------------------------------------- */
	describe('GET /latest ', () => {
		// should respond with a 200 status code
		test('should respond with 200 status code', async () => {
			const response = await request(app)
				.get('/helios-server/temps/latest')
				.send();
			expect(response.statusCode).toBe(200);
		});

		// should specify json in the content type header (IMPORTANT FOR AXIOS)
		test('should respond with JSON object', async () => {
			const response = await request(app)
				.get('/helios-server/temps/latest')
				.send();
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			);
		});
	});

	/*---------------------------------------------Get /oldest------------------------------------------------- */
	describe('GET /oldest ', () => {
		// should respond with a 200 status code
		test('should respond with 200 status code', async () => {
			const response = await request(app)
				.get('/helios-server/temps/oldest')
				.send();
			expect(response.statusCode).toBe(200);
		});

		// should specify json in the content type header (IMPORTANT FOR AXIOS)
		test('should respond with JSON object', async () => {
			const response = await request(app)
				.get('/helios-server/temps/oldest')
				.send();
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			);
		});
	});

	/*---------------------------------------------Get /range------------------------------------------------- */

	describe('Get /range', () => {
		// should respond with a 200 status code
		test('should respond with 200 status code', async () => {
			const response = await request(app)
				.get('/helios-server/temps/range')
				.send();
			expect(response.statusCode).toBe(200);
		});

		// should specify json in the content type header (IMPORTANT FOR AXIOS)
		test('should respond with JSON object', async () => {
			const response = await request(app)
				.get('/helios-server/temps/range')
				.send();
			expect(response.headers['content-type']).toEqual(
				expect.stringContaining('json')
			);
		});
	});
});
