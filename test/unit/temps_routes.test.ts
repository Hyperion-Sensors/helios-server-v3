import request from 'supertest';
import app from '../../index';

// Mock the temp services to avoid DB access
jest.mock('../../src/services/temp_services', () => ({
  getEdge: jest.fn(async (latest: boolean) =>
    latest
      ? [{ id: 1, time: new Date(), fiber_id: 1, max: 10, min: 1, avg: 5 }]
      : [{ id: 2, time: new Date(), fiber_id: 2, max: 9, min: 2, avg: 6 }]
  ),
  getRange: jest.fn(async () => [
    { time_bin: '2025-01-01T00:00:00Z', count: '10' },
    { time_bin: '2025-01-02T00:00:00Z', count: '8' },
  ]),
}));

describe('temps routes', () => {
  it('GET /temps/latest returns latest temps', async () => {
    const res = await request(app).get('/helios-server/temps/latest').send();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('max');
  });

  it('GET /temps/oldest returns oldest temps', async () => {
    const res = await request(app).get('/helios-server/temps/oldest').send();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /temps/range returns aggregated range', async () => {
    const res = await request(app).get('/helios-server/temps/range').send();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('time_bin');
  });
});


