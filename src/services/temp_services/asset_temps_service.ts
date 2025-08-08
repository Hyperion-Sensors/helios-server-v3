import {Temp_Aggregate} from '@/Types/asset_types';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});
import moment from 'moment';
/*---------------------------------------------------Type Imports--------------------------------------------------- */
type most_recent_fibers = {
	fiber_data: {[key: string]: Temp_Aggregate};
	max_fiber_id: string;
};
//retreives
export async function get_last_day_asset(
	bucket_type: string,
	bucket_number: number,
	asset_number: number
): Promise<Array<Temp_Aggregate> | unknown> {
	try {
		const result = await prisma.$queryRaw`
    SELECT * FROM (SELECT time_bucket(${bucket_type}::INTERVAL, time) AS bucket,
      max(max) AS max, min(min) AS min, avg(avg) as avg
      FROM temperature t
      LEFT JOIN fiber f ON f.id = t.fiber_id
      LEFT JOIN asset a ON a.id = f.asset_id
      WHERE a.id = ${asset_number}
      GROUP BY bucket
      ORDER BY bucket DESC 
      LIMIT ${bucket_number}) data
      ORDER BY bucket ASC`;

		// temps = JSON.stringify(temps, (_, v) =>
		//   typeof v === "bigint" ? v.toString() : v
		// );
		// temps = JSON.parse(temps);
		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [
		{
			bucket: null,
			max: null,
			min: null,
			avg: null,
		},
	];
}

//retreives
export async function get_between_times(
	asset_id: number,
	start_date: string,
	end_date: string
): Promise<Array<Temp_Aggregate> | unknown> {
	try {
		const start_time = start_date;
		const end_time = moment(end_date).add(1, 'd');

		const result = await prisma.$queryRaw`
    SELECT time_bucket('1 minute'::INTERVAL, time) AS bucket,
    max(max) AS max, avg(avg) as avg
    FROM temperature t
    LEFT JOIN fiber f ON f.id = t.fiber_id
    LEFT JOIN asset a ON a.id = f.asset_id
    WHERE a.id = ${asset_id} and time >= ${start_time}::timestamptz and time<${end_time}::timestamptz
    GROUP BY bucket
    ORDER BY bucket`;

		// temps = JSON.stringify(temps, (_, v) =>
		//   typeof v === "bigint" ? v.toString() : v
		// );
		// temps = JSON.parse(temps);
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

export async function get_most_recent_asset(
	asset_id: number
): Promise<Array<Temp_Aggregate> | unknown> {
	try {
		//need to add capacity to this query
		const result: Array<Temp_Aggregate> = await prisma.$queryRaw` 
    SELECT t.id, t.fiber_id, t.time, t.max, t.min, t.avg, f.name as fiber_name, f.asset_id, f.start, f.end, c.capacity  from temperature t
    INNER JOIN fiber f on t.fiber_id = f.id 
    LEFT JOIN capacity c on t.time = c.time
    WHERE f.asset_id = ${asset_id}
    ORDER BY t.time DESC
    LIMIT (SELECT COUNT(*) FROM fiber WHERE asset_id = ${asset_id})
      `;

		const final_result: most_recent_fibers = {fiber_data: {}, max_fiber_id: ''};
		//reduce the array to an object where each key is a fiber_id and the value is the object itself
		final_result['fiber_data'] = result.reduce<{[key: string]: Temp_Aggregate}>(
			(acc, curr) => {
				acc[curr.fiber_name] = curr;
				return acc;
			},
			{}
		);

		//find the fiber_id with the highest max value by comparing the max values of each fiber_id object in the fiber_data object
		const fiber_ids: Array<string> = Object.keys(final_result.fiber_data);
		//reduce the array of fiber_ids the fiber id with the max temperature
		final_result['max_fiber_id'] = fiber_ids.reduce((current, next) => {
			//a is the current object iteration, and b is the next object iteration
			return final_result.fiber_data[current].max >
				final_result.fiber_data[next].max
				? current // if current.max is larger than next.max return current
				: next;
		}); //

		return final_result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [
		{
			bucket: null,
			max: null,
			min: null,
			avg: null,
		},
	];
}

export async function get_range_max(
	limit: number,
	raw_table: string
): Promise<Array<{time: string; max: number}> | unknown> {
	try {
		const result = await prisma.$queryRaw`
      SELECT time,
        (SELECT max(m)
        from unnest(temp_celcius) m)
      FROM ${raw_table}
      ORDER BY time DESC
      LIMIT ${limit}
    `;
		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}

export async function get_max_fiber(asset_id: number): Promise<unknown> {
	try {
		const limit_query = await prisma.fiber.count({
			where: {
				asset_id: asset_id,
			},
		});

		/*eslint-disable */
		const result: Array<any> = await prisma.$queryRaw`
        SELECT time_bucket('30 minutes'::INTERVAL, time) AS bucket,
        Max(max) AS max,
        f.name AS fiber_name,
        a.name AS asset_name
        FROM temperature t
        INNER JOIN fiber f ON t.fiber_id = f.id
        INNER JOIN asset a ON f.asset_id = a.id
        WHERE a.id = ${asset_id}
        GROUP BY bucket, f.name, a.name
        ORDER BY bucket DESC
        LIMIT ${limit_query}
    `;
		/*eslint-enable */

		const highest_value = Math.max(...result.map((obj) => obj.max));

		return result.filter((obj) => obj.max === highest_value);
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}

// Returns all assets that have a temperature above 50% of their max allowable temperature in the last 24 hours
export async function get_hot_assets(startDate: string) {
	try {
		startDate = startDate ? startDate : "NOW() - '5 days'::INTERVAL";

		const result: {
			name: string;
			bucket: string;
			max: number;
			threshold: number;
		}[] = await prisma.$queryRawUnsafe(`
    SELECT DISTINCT ON (a.name) a.name, f.name, time_bucket('1 hour'::INTERVAL, time) AS bucket, max(t.max) as max, a.max_allowable_temp as threshold
    FROM temperature t
    INNER JOIN fiber f ON t.fiber_id = f.id
    INNER JOIN asset a ON f.asset_id = a.id
    WHERE t.max >= (a.max_allowable_temp/2) AND time >= '${startDate}'
    GROUP BY bucket, a.name, f.name, max, threshold
    ORDER BY a.name, bucket DESC, max DESC
    `);

		const warm_assets: Array<{
			name: string;
			bucket: string;
			max: number;
			threshold: number;
		}> = [];

		const danger_assets: Array<{
			name: string;
			bucket: string;
			max: number;
			threshold: number;
		}> = [];

		for (let i = 0; i < result.length; i++) {
			if (result[i].max >= result[i].threshold) {
				danger_assets.push(result[i]);
			} else {
				warm_assets.push(result[i]);
			}
		}

		return [warm_assets, danger_assets];
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}
