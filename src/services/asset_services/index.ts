import {PrismaClient, Prisma} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});

/*-----------------------------Type Imports--------------------------- */
import {Filter} from '@/Types/asset_types';

export async function get_all_assets() {
	/*
  Removed capacity from Select Distinct ..."c.capacity," AND "LEFT JOIN capacity c ON a.id = c.asset_id"
  */
	try {
		const result =
			await prisma.$queryRaw`SELECT DISTINCT ON (a.id) a.name, a.id as id, t.name as device, t.sensor_data_table as raw_table,t.id as tfit_id, t.sensor_settings_table as settings_table, t.sensor_diagnostics_table as diagnostics_table, l.coordinates, l.region, 
      s.active as status, f.start, f.end
      FROM asset a
      INNER JOIN tfit t ON a.tfit_id = t.id
      INNER JOIN location l ON t.location_id = l.id
      LEFT JOIN status s ON t.id = s.tfit_id
      LEFT JOIN (SELECT fiber.asset_id,  min(fiber.start) as start, max(fiber.end) as end
      FROM fiber
      GROUP BY fiber.asset_id) as f ON a.id = f.asset_id`;

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}

export async function get_by_device(tfit_id: number) {
	try {
		const result = await prisma.asset.findMany({
			where: {
				tfit_id: {
					equals: tfit_id,
				},
			},
			select: {
				name: true,
				tfit_id: true,
			},
		});

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}

//lists all client tfit locations
export async function get_filtered_assets(filter: Filter) {
	try {
		if (filter.regions.length == 0 && filter.tfits.length == 0) {
			const result = await get_all_assets();
			return result;
		}

		if (filter.regions.length == 0) {
			const result =
				await prisma.$queryRaw`SELECT DISTINCT ON (a.id) a.name, a.id as id, t.name as device, t.sensor_data_table as raw_table,t.id as tfit_id, t.sensor_settings_table as settings_table, t.sensor_diagnostics_table as diagnostics_table, l.coordinates, l.region, 
        s.active as status, c.capacity, f.start, f.end FROM asset a INNER JOIN fiber f ON a.id = f.asset_id INNER JOIN tfit t ON a.tfit_id = t.id INNER JOIN location l ON t.location_id = l.id LEFT JOIN status s ON t.id = s.tfit_id LEFT JOIN capacity c ON a.id = c.asset_id WHERE t.name in (${Prisma.join(
					filter.tfits
				)}) and s.active=true`;
			return result;
		} else if (filter.tfits.length == 0) {
			const result =
				await prisma.$queryRaw`SELECT DISTINCT ON (a.id) a.name, a.id as id, t.name as device, t.sensor_data_table as raw_table,t.id as tfit_id, t.sensor_settings_table as settings_table, t.sensor_diagnostics_table as diagnostics_table, l.coordinates, l.region, 
        s.active as status, c.capacity, f.start, f.end FROM asset a INNER JOIN fiber f ON a.id = f.asset_id INNER JOIN tfit t ON a.tfit_id = t.id INNER JOIN location l ON t.location_id = l.id LEFT JOIN status s ON t.id = s.tfit_id LEFT JOIN capacity c ON a.id = c.asset_id WHERE l.region in (${Prisma.join(
					filter.regions
				)}) and s.active=true`;
			return result;
		} else {
			const result =
				await prisma.$queryRaw`SELECT DISTINCT ON (a.id) a.name, a.id as id, t.name as device, t.sensor_data_table as raw_table,t.id as tfit_id, t.sensor_settings_table as settings_table, t.sensor_diagnostics_table as diagnostics_table, l.coordinates, l.region, 
        s.active as status, c.capacity, f.start, f.end FROM asset a INNER JOIN fiber f ON a.id = f.asset_id INNER JOIN tfit t ON a.tfit_id = t.id INNER JOIN location l ON t.location_id = l.id LEFT JOIN status s ON t.id = s.tfit_id LEFT JOIN capacity c ON a.id = c.asset_id WHERE t.name in (${Prisma.join(
					filter.tfits
				)}) and l.region in (${Prisma.join(filter.regions)}) and s.active=true`;
			return result;
		}
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}

//get all assets by status
export async function get_by_asset_status(status: boolean) {
	try {
		const result =
			await prisma.$queryRaw`SELECT DISTINCT ON (a.id) a.name, a.id as id, t.name as device, t.sensor_data_table as raw_table, l.coordinates, l.region, 
      s.active as status, c.capacity, f.start, f.end
      FROM asset a
      INNER JOIN tfit t ON a.tfit_id = t.id
      INNER JOIN location l ON t.location_id = l.id
      LEFT JOIN status s ON t.id = s.tfit_id
      LEFT JOIN capacity c ON a.id = c.asset_id
      LEFT JOIN (SELECT fiber.asset_id,  min(fiber.start) as start, max(fiber.end) as end
      FROM fiber
      GROUP BY fiber.asset_id) as f ON a.id = f.asset_id
      WHERE a.active=${status}`; //status = true or false

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}

export async function get_by_device_status(status: boolean) {
	try {
		const result =
			await prisma.$queryRaw`SELECT DISTINCT ON (a.id) a.name, a.id as id, t.name as device, l.coordinates, l.region, s.active as status, c.capacity
        FROM asset a
        INNER JOIN tfit t ON a.tfit_id = t.id
        INNER JOIN location l ON t.location_id = l.id
        LEFT JOIN status s ON t.id = s.tfit_id
        LEFT JOIN capacity c ON a.id = c.asset_id
        WHERE s.active=${status}`;

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}

// Temporary query, will be removed and incorporated into get_all_assets
export async function get_fibers(asset_id: number) {
	/*
    SELECT fiber.id, fiber.name FROM fiber WHERE fiber.asset_id = 1;
    */
	const fibers = await prisma.fiber.findMany({
		where: {
			asset_id: asset_id,
		},
		select: {
			id: true,
			name: true,
		},
	});

	return fibers;
}
