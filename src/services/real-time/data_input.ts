import {RealTimeRepository} from '../../repositories/realTimeRepository';
import {prisma} from '../../lib/prisma';
const repo = new RealTimeRepository(prisma);

/*---------------------------------------------------Type Imports--------------------------------------------------- */
interface temps {
	temp_celcius: number[];
}

export async function put_sensor_data(
	tfit: string,
	settings_id: number,
	time: any,
	frequency_mhz: number[],
	temp_celcius: number[],
	strain: any
): Promise<boolean | unknown> {
	try {
		const table = 'sensor_data_' + tfit;
		const result = await repo.insertSensorData(table, {
			settings_id,
			time,
			frequency_mhz,
			temp_celcius,
			strain,
		});
		return Array.isArray(result) ? true : !!result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
} // Service to insert sensor data
