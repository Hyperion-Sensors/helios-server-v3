import {PrismaClient} from '@prisma/client';

// Create a single PrismaClient instance app-wide
// In development, reuse the instance via globalThis to avoid exhausting connections on hot-reload
declare global {
	// eslint-disable-next-line no-var
	var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient =
	global.prismaGlobal ?? new PrismaClient({log: ['error']});

if (process.env.NODE_ENV !== 'production') {
	global.prismaGlobal = prisma;
}
