import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

interface temp {
	id: number;
	time: Date;
	fiber_id: number;
	max: number;
	min: number;
	avg: number;
}

export async function getEdge(latest: boolean) {
	//Get either the earliest or latest temperature points available
	try {
		const temps = await prisma.temperature.findMany({
			orderBy: [{time: latest ? 'desc' : 'asc'}],
			take: 1,
		});

		return temps;
		Promise<temp[]>;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}

export async function getRange() {
	try {
		let temps: string =
			await prisma.$queryRaw`SELECT time_bucket('12 hours', time) AS time_bin, count(avg) FROM temperature GROUP BY time_bin ORDER BY time_bin DESC LIMIT 10;`; //example of running a timescaleDB function

		temps = JSON.stringify(temps, (_, v) =>
			typeof v === 'bigint' ? v.toString() : v
		);
		temps = JSON.parse(temps);
		return temps;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}
