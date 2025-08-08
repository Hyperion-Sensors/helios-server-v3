import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

/*---------------------------------------------------Types---------------------------------------------------- */

export default async function latest_load() {
	try {
		const result = await prisma.load.findFirst();

		// temps = JSON.stringify(temps, (_, v) =>
		//   typeof v === "bigint" ? v.toString() : v
		// );
		// temps = JSON.parse(temps);
		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}
