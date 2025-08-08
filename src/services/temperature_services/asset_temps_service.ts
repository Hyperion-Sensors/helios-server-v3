import {Temp_Aggregate} from '@/Types/asset_types';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});

/*---------------------------------------------------Type Imports--------------------------------------------------- */

//retreives
export default async function get_last_day_asset(
	bucket_type: string,
	bucket_number: number
): Promise<Array<Temp_Aggregate> | unknown> {
	try {
		const result = await prisma.$queryRaw`
        SELECT time_bucket(${bucket_type}::INTERVAL, time) AS bucket,
        max(max) AS max, min(min) AS min, avg(avg) 
        FROM temperature 
        GROUP BY bucket 
        ORDER BY bucket 
        ASC LIMIT ${bucket_number}`;

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
