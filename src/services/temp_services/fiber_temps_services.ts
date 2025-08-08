import {Temp_Aggregate} from '@/Types/asset_types';
import {PrismaClient} from '@prisma/client';
import moment from 'moment';
const prisma = new PrismaClient({log: ['query']});

/*---------------------------------------------------Type Imports--------------------------------------------------- */
interface temps {
	temp_celcius: number[];
}
// Retreives a range of temperature data from a beginning to end length
export async function get_range_temps(
	start: number,
	end: number,
	tfit_table: string
): Promise<Array<number[]> | unknown> {
	try {
		const result: Array<temps> = await prisma.$queryRawUnsafe(`
        SELECT temp_celcius
        FROM "${tfit_table}"
        ORDER BY time desc
        LIMIT 1`);

		const temp_data = result[0].temp_celcius.slice(start, end);

		return temp_data;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}
/*eslint-disable */
export async function get_range_temps_aggregate(
	aggregate_type: string,
	fiber_id: number,
	interval: string,
	start: string,
	end: string
): Promise<Array<any> | unknown> {
	/*eslint-enable */

	try {
		const bucket = interval ? interval : '5 minutes';
		let aggregate_query = '';

		if (aggregate_type == 'max') {
			aggregate_query = 'max(max) AS max';
		} else if (aggregate_type == 'avg') {
			aggregate_query = 'avg(avg) AS avg';
		}

		start = start ? start : "NOW() - '5 days'::INTERVAL";
		end = end ? moment(end).add(1, 'days').toISOString() : 'NOW()'; // add one day to include the end date

		const result = await prisma.$queryRawUnsafe(`
      SELECT time_bucket('${bucket}'::INTERVAL, time) AS bucket,
      ${aggregate_query}
      FROM temperature
      WHERE fiber_id = ${fiber_id}
      AND time <= '${end}' AND time >= '${start}'
      GROUP BY bucket
      ORDER BY bucket DESC
    `);

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [
		{
			bucket: null,
			[aggregate_type]: null,
		},
	];
}

//retreives
export async function get_last_day_fiber(
	bucket_type: string,
	bucket_number: number,
	fiber_name: string
): Promise<Array<Temp_Aggregate> | unknown> {
	try {
		const result = await prisma.$queryRaw`
    SELECT * FROM (SELECT time_bucket(${bucket_type}::INTERVAL, time) AS bucket,
    ROUND(max(max)::NUMERIC, 2)::FLOAT AS max,
    ROUND(min(min)::NUMERIC, 2)::FLOAT AS min,
    ROUND(avg(avg)::NUMERIC, 2)::FLOAT as avg
      FROM temperature t
      LEFT JOIN fiber f ON f.id = t.fiber_id
      LEFT JOIN asset a ON a.id = f.asset_id
      WHERE f.name = ${fiber_name}
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
