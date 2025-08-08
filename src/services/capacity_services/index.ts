import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});

// retreives the last capacity value for all assets
//formatted as an object containing multiple objects container the information in the type definition
export async function latest_capacity_values() {
	type up_result = {
		name: string;
		capacity: number;
	};
	try {
		const unprocessed_result: up_result[] = await prisma.$queryRaw`
    SELECT DISTINCT ON (asset_id) a.name, capacity
    FROM capacity c
    INNER JOIN asset a ON c.asset_id = a.id
    INNER JOIN tfit t ON a.tfit_id = t.id
    ORDER BY asset_id, time desc;
    `;

		const result = unprocessed_result.reduce(
			(obj, item) => Object.assign(obj, {[item.name]: item.capacity}),
			{}
		);

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}

// This route gets a number of capacity values for a given asset
export async function recent_capacity(asset_id: number, limit: number) {
	try {
		const result = await prisma.$queryRaw`
    SELECT time, capacity
    FROM capacity
    WHERE asset_id = ${asset_id}
    ORDER BY time DESC
    LIMIT ${limit}
    `;

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}

export async function hour_aggregate(interval: number) {
	type up_result = {
		bucket: string;
		avg_capacity: number;
	};
	try {
		const unprocessed_result: up_result[] = await prisma.$queryRaw`
    SELECT time_bucket('${String(interval)} hour'::INTERVAL, time) AS bucket,
    avg(capacity) as "avg_capacity"
    FROM capacity
    GROUP BY bucket
    ORDER BY bucket ASC 
    LIMIT 6`;

		return unprocessed_result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}

export async function recent_load(asset_id: number, limit: number) {
	try {
		const result = await prisma.$queryRaw`
    SELECT * FROM load WHERE asset_id = ${asset_id} ORDER BY time DESC LIMIT ${limit}
    `;

		return JSON.parse(
			JSON.stringify(
				result,
				(key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
			)
		);
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}
