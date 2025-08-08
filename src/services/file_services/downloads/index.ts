import {
	Asset_Temp_Aggregate,
	Fiber_Temp_Data,
	Systems,
	Temp_Aggregate,
} from '@/Types/file_types';
import {PrismaClient, Prisma} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});
import moment from 'moment';
/*---------------------------------------------------Type Imports--------------------------------------------------- */
type most_recent_fibers = {
	fiber_data: {[key: string]: Temp_Aggregate};
	max_fiber_id: string;
};

//gets all aggregate asset_temps
export async function get_downloadable_asset_temps(
	asset_names: Array<string>,
	start_date: string,
	end_date: string,
	fahrenheit = false
): Promise<Array<Asset_Temp_Aggregate> | unknown> {
	try {
		// const start_time = start_date;
		// const end_time = moment(end_date).add(1, 'd');
		let result;
		if (fahrenheit) {
			result = await prisma.$queryRaw` 
				SELECT a.name as asset_name, time_bucket('1 minute'::INTERVAL, time ) AS timestamp,
				 avg((avg * 9/5) + 32) as avg_temp_fahrenheit
				FROM temperature t
				LEFT JOIN fiber f ON f.id = t.fiber_id
				LEFT JOIN asset a ON a.id = f.asset_id
				WHERE a.name in (${Prisma.join(
					asset_names
				)}) and time >= ${start_date}::timestamptz and time < ${end_date}::timestamptz
				GROUP BY a.name, timestamp
				ORDER BY timestamp DESC`;
		} else {
			result = await prisma.$queryRaw`
				SELECT a.name as asset_name, time_bucket('1 minute'::INTERVAL, time) AS timestamp,
			 	avg(avg) as avg_temp_celsius
				FROM temperature t
				LEFT JOIN fiber f ON f.id = t.fiber_id
				LEFT JOIN asset a ON a.id = f.asset_id
				WHERE a.name in (${Prisma.join(
					asset_names
				)}) and time >= ${start_date}::timestamptz and time<${end_date}::timestamptz
				GROUP BY a.name, timestamp
				ORDER BY timestamp DESC`;
		}

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [
		{
			asset_name: null,
			time: null,
			avg_temp_celsius: null,
		},
	];
}

//gets all aggregate asset_temps
export async function get_all_downloadable_asset_temps(
	start_date: string,
	end_date: string,
	imperial = false
): Promise<Array<Temp_Aggregate> | unknown> {
	try {
		const start_time = start_date;
		const end_time = moment(end_date).add(1, 'd');
		let result;
		if (imperial) {
			result = await prisma.$queryRaw` 
			
				 SELECT a.name as asset_name, 
				time_bucket('1 minute'::INTERVAL, time) AS time,
				avg((avg * 9/5) + 32) as avg_temp_fahrenheit
				FROM temperature t
				LEFT JOIN fiber f ON f.id = t.fiber_id
				LEFT JOIN asset a ON a.id = f.asset_id
				WHERE time >= ${start_time}::timestamptz and time < ${end_time}::timestamptz
				GROUP BY a.name, time
				ORDER BY asset_name ASC, time DESC `;
		} else {
			result = await prisma.$queryRaw`
				SELECT a.name as asset_name, 
				time_bucket('1 minute'::INTERVAL, time) AS timestamp,
				avg(avg) as avg_temp_celsius
				FROM temperature t
				LEFT JOIN fiber f ON f.id = t.fiber_id
				LEFT JOIN asset a ON a.id = f.asset_id
				WHERE time >= ${start_time}::timestamptz and time < ${end_time}::timestamptz
				GROUP BY a.name, timestamp
				ORDER BY asset_name ASC, timestamp DESC `;
		}

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [
		{
			bucket: null,
			max: null,
			avg: null,
		},
	];
}

//gets all aggregate asset_temps
export async function get_downloadable_fiber_temps(
	asset_names: Array<string>,
	start_date: string,
	end_date: string,
	imperial = false
): Promise<Array<Fiber_Temp_Data> | unknown> {
	try {
		const start_time = start_date;
		const end_time = moment(end_date).add(1, 'd');
		let result;
		if (imperial) {
			result = await prisma.$queryRaw` 
			SELECT  a.name as asset_name, f.name as sensor_zone, t.time, avg((avg * 9/5) + 32) as avg_temp_fahrenheit FROM temperature t
			INNER JOIN fiber f ON t.fiber_id = f.id
			INNER JOIN asset a ON f.asset_id = a.id
			WHERE a.name in (${Prisma.join(
				asset_names
			)}) and time >= ${start_time}::timestamptz and time<${end_time}::timestamptz
			GROUP BY f.name, t.time, t.avg, a.name
			ORDER BY t.time DESC`;
		} else {
			result = await prisma.$queryRaw`
			SELECT  a.name as asset_name, f.name as sensor_zone, t.time, t.avg as avg_temp_celsius FROM temperature t
			INNER JOIN fiber f ON t.fiber_id = f.id
			INNER JOIN asset a ON f.asset_id = a.id
			WHERE a.name in (${Prisma.join(
				asset_names
			)}) and time >= ${start_time}::timestamptz and time<${end_time}::timestamptz 
			GROUP BY f.name, t.time, t.avg, a.name
			ORDER BY t.time DESC`;
		}
		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [
		{
			sensor_zone: null,
			time: null,
			avg_temp_celsius: null,
		},
	];
}

//gets all system data for specific business unit
export async function get_all_systems(): Promise<Systems[] | unknown> {
	try {
		const result = await prisma.$queryRaw` 
				SELECT 
				t.name AS System_ID,
				l.name AS System_Name,
				l.coordinates[1] as latitude,
				l.coordinates[2] as longitude,
				l.region,
				COUNT(a.name) AS number_of_assets
				FROM tfit t
				INNER JOIN location l ON t.location_id = l.id
				LEFT JOIN asset a ON t.id = a.tfit_id
				GROUP BY t.name, l.name, l.coordinates, l.region`;
		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [
		{
			id: null,
			name: null,
			latitude: null,
			longitude: null,
			region: null,
			number_of_assets: null,
		},
	];
}

export async function get_downloadable_assets() {
	/*
  Removed capacity from Select Distinct ..."c.capacity," AND "LEFT JOIN capacity c ON a.id = c.asset_id"
  */
	try {
		const result = await prisma.$queryRaw`
			SELECT DISTINCT ON (a.id) a.id as asset_id, a.name as asset_name, COUNT(f.name) AS sensor_zone_count, t.name as System_name, l.region
			FROM asset a
			INNER JOIN tfit t ON a.tfit_id = t.id
			INNER JOIN location l ON t.location_id = l.id
			LEFT JOIN status s ON t.id = s.tfit_id
			LEFT JOIN  fiber f ON a.id = f.asset_id
			GROUP BY a.name, a.id, t.name, l.region`;
		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}

export async function get_downloadable_sensor_zones() {
	/*
  Removed capacity from Select Distinct ..."c.capacity," AND "LEFT JOIN capacity c ON a.id = c.asset_id"
  */
	try {
		const result = await prisma.$queryRaw`
			SELECT DISTINCT ON (a.id) a.name as asset_name, a.id as asset_id, COUNT(f.name) AS sensor_zone_count, t.name as system, l.region
			FROM asset a
			INNER JOIN tfit t ON a.tfit_id = t.id
			INNER JOIN location l ON t.location_id = l.id
			LEFT JOIN status s ON t.id = s.tfit_id
			LEFT JOIN  fiber f ON a.id = f.asset_id
			GROUP BY a.name, a.id, t.name, l.region`;
		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}
export const trial_data = [
	{
		name: 'dlc-23572-pnc',
		id: 1,
		device: 'DLC-23572-PNC',
		raw_table: 'sensor_data_duquesne_c5_prod',
		tfit_id: 2,
		settings_table: 'sensor_settings_duquesne_c5_prod',
		diagnostics_table: 'sensor_diagnostics_duquesne_c5_prod',
		coordinates: ['40.44707222662531', '-80.0072211892643'],
		region: 'Pittsburgh',
		status: true,
		start: 25,
		end: 264,
	},
	{
		name: 'dlc-23572-preble-cable',
		id: 3,
		device: 'DLC-23572-Preble',
		raw_table: 'sensor_data_duquesne_c3_prod',
		tfit_id: 3,
		settings_table: 'sensor_settings_duquesne_c3_prod',
		diagnostics_table: 'sensor_diagnostics_duquesne_c3_prod',
		coordinates: ['40.45876507676984', '-80.03352449899484'],
		region: 'Pittsburgh',
		status: null,
		start: 25,
		end: 3071,
	},
	{
		name: 'dlc-23572-preble-splices',
		id: 4,
		device: 'DLC-23572-Preble',
		raw_table: 'sensor_data_duquesne_c3_prod',
		tfit_id: 3,
		settings_table: 'sensor_settings_duquesne_c3_prod',
		diagnostics_table: 'sensor_diagnostics_duquesne_c3_prod',
		coordinates: ['40.45876507676984', '-80.03352449899484'],
		region: 'Pittsburgh',
		status: null,
		start: 76.8056,
		end: 3057.996,
	},
	{
		name: 'dlc-23572-preble-man-holes',
		id: 5,
		device: 'DLC-23572-Preble',
		raw_table: 'sensor_data_duquesne_c3_prod',
		tfit_id: 3,
		settings_table: 'sensor_settings_duquesne_c3_prod',
		diagnostics_table: 'sensor_diagnostics_duquesne_c3_prod',
		coordinates: ['40.45876507676984', '-80.03352449899484'],
		region: 'Pittsburgh',
		status: null,
		start: 64,
		end: 3042,
	},
];
