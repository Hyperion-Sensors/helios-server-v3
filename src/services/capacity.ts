import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export default async function latest_capacity() {
	try {
		const result = await prisma.capacity.findFirst();

		// temps = JSON.stringify(temps, (_, v) =>
		//   typeof v === "bigint" ? v.toString() : v
		// );
		// temps = JSON.parse(temps);
		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}
