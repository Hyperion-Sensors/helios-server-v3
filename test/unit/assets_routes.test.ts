import request from 'supertest';
import app from '../../index';

// Mock asset services used by routes
jest.mock('../../src/services/temp_services/asset_temps_service', () => ({
  get_last_day_asset: jest.fn(async () => ([
    { bucket: '2025-01-01T00:00:00Z', max: 10, min: 1, avg: 5 },
  ])),
  get_between_times: jest.fn(async () => ([
    { bucket: '2025-01-01T00:00:00Z', max: 10, avg: 5 },
  ])),
  get_most_recent_asset: jest.fn(async () => ({
    fiber_data: {
      F1: { id: 1, time: new Date().toISOString(), fiber_id: 1, max: 10, min: 1, avg: 5, fiber_name: 'F1', asset_id: 1, start: 0, end: 1, capacity: 0.5 },
      F2: { id: 2, time: new Date().toISOString(), fiber_id: 2, max: 8, min: 2, avg: 6, fiber_name: 'F2', asset_id: 1, start: 0, end: 1, capacity: 0.5 },
    },
    max_fiber_id: 'F1',
  })),
  get_max_fiber: jest.fn(async () => ([{ bucket: '2025-01-01T00:00:00Z', max: 10, fiber_name: 'F1', asset_name: 'A1' }])),
  get_hot_assets: jest.fn(async () => ([
    [{ name: 'A1', bucket: '2025-01-01T00:00:00Z', max: 51, threshold: 100 }],
    [{ name: 'A2', bucket: '2025-01-01T00:00:00Z', max: 110, threshold: 100 }],
  ])),
}));

describe('asset temps routes', () => {
  it('POST /temps/assets/aggregate returns last day asset aggregate', async () => {
    const res = await request(app)
      .post('/helios-server/temps/assets/aggregate')
      .send({ bucket_type: '1 hour', bucket_number: 24, asset_number: 1 });
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('bucket');
  });

  it('POST /temps/assets/range-aggregate returns between times aggregate', async () => {
    const res = await request(app)
      .post('/helios-server/temps/assets/range-aggregate')
      .send({ asset_id: 1, start_date: '2025-01-01', end_date: '2025-01-02' });
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('bucket');
  });

  it('GET /temps/assets/most-recent-temps returns most recent by asset', async () => {
    const res = await request(app)
      .get('/helios-server/temps/assets/most-recent-temps?id=1')
      .send();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('fiber_data');
  });
});


