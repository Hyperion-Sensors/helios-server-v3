import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});

export async function get_all_notifications() {
	try {
		const result = await prisma.$queryRaw`
	SELECT notifications.*, asset.name as asset_name, fiber.name as fiber_name
    FROM notifications
	INNER JOIN asset ON asset.id = notifications.asset_id
	INNER JOIN fiber ON fiber.id = notifications.fiber_id

    `;

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}

export async function get_recent_notifications() {
	try {
		const result = await prisma.$queryRaw`
    SELECT *
    FROM notifications
    ORDER BY time DESC
    LIMIT 10
    `;

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}
