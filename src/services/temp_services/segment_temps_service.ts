import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});

interface temps {
	temp_celcius: number[];
}

interface Setting_Object_Type {
	/* eslint-disable */
	[key: string]: any;
	/* eslint-enable */
}

// Queries the database and gets the temperature for multiple segments
export default async function get_segment_temps(
	asset_id: number,
	tfit_table: string,
	settings_table: string,
	imperial?: boolean //are the units to be reported in imperal distanct (Ft) and temperature (F)?
): Promise<Array<number[]> | unknown> {
	try {
		const fiber_segments: {
			start: number;
			end: number;
			name: string;
			min: number;
			max: number;
		}[] = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT f.start, f.end, f.name, (SELECT min(f.start) from fiber f WHERE asset_id = ${asset_id}) as min, (SELECT max(f.end) from fiber f WHERE asset_id = ${asset_id}) as max
      FROM fiber f
      WHERE asset_id = ${asset_id}
      ORDER BY start ASC`);

		//will change this when apache kafka is used
		const result: Array<temps> = await prisma.$queryRawUnsafe(` 
        SELECT temp_celcius
        FROM "${tfit_table}"
        ORDER BY time desc
        LIMIT 1`);

		const settings: Array<{settings: Setting_Object_Type}> =
			await prisma.$queryRawUnsafe(`
        SELECT settings
        FROM "${settings_table}"
        ORDER BY id DESC
        LIMIT 1`);

		//poistion increment in meters, if imperial is true then will convert to feet
		const interval = settings[0].settings.position_increment;

		const segmentedData = Array(fiber_segments.length).fill([]);

		fiber_segments.push({
			start: Math.round(
				fiber_segments[0].min
				// settings[0].settings.start_position ||
				// 	settings[0].settings.position_start
			), //set to settings start
			end: Math.round(
				fiber_segments[0].max
				// settings[0].settings.end_position || settings[0].settings.position_end
			), //set to settings end
			name: 'Full Fiber',
			max: fiber_segments[0].max,
			min: fiber_segments[0].min,
		});

		/* eslint-disable */
		const responseData: any = {};
		/* eslint-enable */
		for (let i = 0; i < fiber_segments.length; i++) {
			/* eslint-disable */
			const processed: any = [];
			/* eslint-enable */
			const start = fiber_segments[i].start; //start point of segment in meters
			const end = fiber_segments[i].end; //end point of segment in meters
			const si = start / interval; //start point of segment on data array corresponding to interval
			const sp = (end - start) / interval + si; //end point of segment on data array corresponding to interval
			// Slicing the full temps into a segment

			segmentedData[i] = result[0].temp_celcius.slice(
				Math.floor(si),
				Math.ceil(sp)
			);
			// Attaching each temperature point to an index
			// based on the asset interval
			// (index * interval) + start

			segmentedData[i].forEach((value: number, index: number) => {
				if (value > -50 && value < 500)
					//remove obvious peeks from data
					processed.push(
						//if imperial is true then convert to feet and fahrenheit
						imperial
							? {
									x: (start + index * interval) * 3.28084, //convert to feet
									y: value * 1.8 + 32, //convert to fahrenheit
							  }
							: {x: start + index * interval, y: value}
					);
				else processed.push({x: start + index * interval, y: null});
			});

			responseData[fiber_segments[i].name] = processed;
		}

		responseData['segments'] = fiber_segments;
		return responseData;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return [];
}
