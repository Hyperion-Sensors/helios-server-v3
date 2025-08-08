import {RealTimeRepository} from '../../repositories/realTimeRepository';
import {prisma} from '../../lib/prisma';
const repo = new RealTimeRepository(prisma);

type new_temp_data = {
	sensor_table: string;
	id: number;
	settings_id: number;
	time: Date;
	frequency: number[];
	temp_celcius: number[];
	strain: number[];
};
type new_sensor_data = {
	sensor_table: string;
	id: number;
	settings: number;
	time: Date;
};
type latest_date = {
	time: Date;
};

export async function add_raw_data(
	data: new_temp_data
): Promise<boolean | unknown> {
  const table_name = data.sensor_table as string;
  const latest = await repo.getLatestTime(table_name);
  if (latest) {
		try {
			const newTime = new Date(data.time); //get new date from req.body
      const oldTime = new Date(latest); //get latest date from db

			console.log(newTime.toISOString() < oldTime.toISOString()); //change to timestampTZ type
			console.log(newTime.toISOString(), oldTime.toISOString()); //change to timestampTZ type
      if (newTime > oldTime) {
        await repo.insertSensorData(table_name, {
          id: data.id,
          settings_id: data.settings_id,
          time: new Date(newTime.toISOString()),
          frequency_mhz: data.frequency,
          temp_celcius: data.temp_celcius,
          strain: data.strain,
        });
        return {message: 'Data successfully added', status: 200};
      }
      return {message: 'Conflict occurred with latest row', status: 409};
		} catch (err) {
			console.log(err); // eslint-disable-line
			return {message: 'Error adding data', status: 500};
		}
	} else {
		try {
      await repo.insertSensorData(table_name, {
        id: 1,
        settings_id: 1,
        time: new Date(Date.now()),
        frequency_mhz: [0.0],
        temp_celcius: [0.0],
        strain: [],
      });
			return {
				message: 'No Data, added start data. Re-load and try again',
				status: 400,
			};
		} catch (err) {
			console.log(err); // eslint-disable-line

			return {message: 'Error adding data', status: 500};
		}
	}
}

export async function add_settings(
	data: new_sensor_data
): Promise<boolean | unknown> {
  const table_name = data.sensor_table as string;
  const latest = await repo.getLatestTime(table_name);
  if (latest) {
		try {
			const newTime = new Date(data.time); //get new date from req.body
      const oldTime = new Date(latest); //get latest date from db

			console.log(newTime.toISOString() < oldTime.toISOString()); //change to timestampTZ type
			console.log(newTime.toISOString(), oldTime.toISOString()); //change to timestampTZ type
      if (newTime > oldTime) {
        await repo.insertSensorSettings(table_name, {
          id: data.id,
          settings: data.settings,
          time: new Date(newTime.toISOString()),
        });
        return {message: 'Settings successfully added', status: 200};
      }
      return {message: 'Conflict occurred with latest row', status: 409};
		} catch (err) {
			console.log(err); // eslint-disable-line
			return {message: 'Error adding settings', status: 500};
		}
	} else {
		try {
      await repo.insertSensorSettings(table_name, {
        id: 1,
        settings: 1,
        time: new Date(Date.now()),
      });
			return {
				message: 'No Data, added start settings. Re-load and try again',
				status: 400,
			};
		} catch (err) {
			console.log(err); // eslint-disable-line

			return {message: 'Error adding settings', status: 500};
		}
	}
}
