import request from 'supertest';
import app from '../../index';

jest.mock('../../src/services/temp_services/fiber_temps_services', () => ({
	get_range_temps: jest.fn(async () => [{time: 't1', values: [1, 2, 3]}]),
	get_range_temps_aggregate: jest.fn(async () => [{bucket: 'b1', max: 10}]),
	get_last_day_fiber: jest.fn(async () => [
		{bucket: 'b1', max: 10, min: 1, avg: 5},
	]),
}));

jest.mock('../../src/services/temp_services/segment_temps_service', () => ({
	__esModule: true,
	default: jest.fn(async () => [{segment: 's1', max: 10}]),
}));

describe('fiber temps routes', () => {
	it('POST /temps/fiber/range returns range temps', async () => {
		const res = await request(app)
			.post('/helios-server/temps/fiber/range')
			.send({start: 0, end: 10, tfit: 'tb_raw'});
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('POST /temps/fiber/segment returns segmented temps', async () => {
		const res = await request(app)
			.post('/helios-server/temps/fiber/segment')
			.send({asset_id: 1, raw_table: 'tb_raw', settings_table: 'tb_settings'});
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('POST /temps/fiber/aggregate returns last day fiber aggregate', async () => {
		const res = await request(app)
			.post('/helios-server/temps/fiber/aggregate')
			.send({bucket_type: '1 hour', bucket_number: 24, fiber_name: 'F1'});
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it('POST /temps/fiber/range-aggregate returns aggregate over time range', async () => {
		const res = await request(app)
			.post('/helios-server/temps/fiber/range-aggregate')
			.send({
				aggregate_type: 'max',
				fiber_id: 1,
				interval: '1 hour',
				start: '2025-01-01',
				end: '2025-01-02',
			});
		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
});
