import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});

/*---------------------------------------------------Type Imports--------------------------------------------------- */
interface temps {
	temp_celcius: number[];
}
// Retreives a range of temperature data from a beginning to end length
export default async function get_range_temps(
	start: number,
	end: number,
	tfit: string
): Promise<Array<number[]> | unknown> {
	try {
		const table = 'sensor_data_' + tfit;
		const result: Array<temps> = await prisma.$queryRawUnsafe(`
        SELECT temp_celcius
        FROM "${table}"
        ORDER BY time desc
        LIMIT 1`);

		const temp_data = result[0].temp_celcius.slice(start, end);

		return temp_data;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}
