import request from 'supertest';
import app from '../../index';
// import {Response} from 'express';
describe('Testing routes for asset temps (temps/asset) ', () => {
	describe('POST /aggregate', () => {
		test('POST /aggregate -> should return the last day asset for the given inputs', async () => {
			jest.setTimeout(30000);

			const body = {
				bucket_type: '1 hour',
				bucket_number: 24,
				asset_number: 4,
			};
			const expected = {
				bucket: expect.any(String),
				max: expect.any(Number),
				min: expect.any(Number),
				avg: expect.any(Number),
			};

			const response = await request(app)
				.post('/helios-server/temps/assets/aggregate')
				.send(body)
				.expect(200);

			expect(response.body[0]).toEqual(expected);
		});
	});
});
