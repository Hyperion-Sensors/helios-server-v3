import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});

/*---------------------------------------------------Type Imports--------------------------------------------------- */

//lists all client tfit devices
export async function get_all_tfits() {
	try {
		const result = await prisma.tfit.findMany({
			select: {
				id: true,
				name: true,
				asset: true,
				location: true,
			},
		});

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}

//lists all client tfit locations
export async function get_all_regions() {
	try {
		const result = await prisma.location
			.findMany({
				select: {
					region: true,
				},
			})
			.then((regions) => regions.map((item) => item.region));
		const unique_regions = [...new Set(result)];
		return unique_regions;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}

//gets substations status defined by tfit id
export async function get_tfit_status(tfit_id: number) {
	try {
		//prisma query raw
		const result =
			await prisma.$queryRaw`SELECT * FROM (SELECT max(last) as max, fiber_id from (SELECT fiber_id, time_bucket('5 minutes', time) AS interval,
      last(max, time)
    FROM temperature
    INNER JOIN fiber ON fiber.id= temperature.fiber_id
    INNER JOIN asset ON fiber.asset_id = asset.id
    INNER JOIN tfit ON asset.tfit_id = tfit.id
    WHERE time > now () - INTERVAL '3 year' and tfit.id = ${tfit_id}
    GROUP BY fiber_id, interval, max
    ORDER BY interval DESC
    LIMIT (SELECT COUNT(fiber.id) FROM fiber INNER JOIN asset a on a.id = fiber.asset_id INNER JOIN tfit t ON t.id = a.tfit_id WHERE t.id=${tfit_id})) sub
    GROUP BY fiber_id) subsub
    INNER JOIN fiber on subsub.fiber_id = fiber.id
    INNER JOIN asset ON fiber.asset_id = asset.id
    INNER JOIN tfit ON asset.tfit_id = tfit.id
    LEFT JOIN status ON tfit.id = status.tfit_id;`;

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

export async function get_problem_fibers() {
	try {
		//prisma query raw
		const result = await prisma.$queryRaw`WITH FibersRanked AS (
			SELECT *,
			ROW_NUMBER() OVER(PARTITION BY fiber_id ORDER BY time DESC) as rn
			FROM temperature t
			INNER JOIN fiber f ON f.id = t.fiber_id
			INNER JOIN asset a ON a.id = f.asset_id
			INNER JOIN tfit ON tfit.id = a.tfit_id
		),
		FilteredFibers AS (
			SELECT  asset_id,  fiber_id
			FROM FibersRanked F
			INNER JOIN asset a ON a.id = F.asset_id
			WHERE rn = 1 AND max > a.max_allowable_temp
		)
		SELECT a.id as asset_id, COALESCE(COUNT(ff.fiber_id), 0) as fiber_count
		FROM asset a
		LEFT JOIN FilteredFibers ff ON a.id = ff.asset_id
		GROUP BY a.id`;

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
