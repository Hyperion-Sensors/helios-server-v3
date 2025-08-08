// Global Prisma client mock to avoid DB access in unit tests by default.
// Individual tests can override by mocking specific service modules.

jest.mock('@prisma/client', () => {
	const mockClient = {
		user_settings: {
			findUnique: jest
				.fn()
				.mockImplementation(async ({where: {user_id}}: any) => {
					if (user_id === (process.env.TEST_USER_ID || 'test-user-id')) {
						return {
							user_id,
							settings: {general: {Theme: 'dark'}, data_options: {}},
							saved_at: new Date().toISOString(),
						};
					}
					return null;
				}),
			update: jest.fn().mockResolvedValue(true),
			create: jest.fn().mockResolvedValue(true),
		},
		temperature: {
			findMany: jest.fn().mockResolvedValue([]),
		},
		fiber: {
			count: jest.fn().mockResolvedValue(1),
		},
		$queryRaw: jest.fn().mockResolvedValue([]),
		$queryRawUnsafe: jest.fn().mockResolvedValue([]),
	};

	return {
		PrismaClient: jest.fn().mockImplementation(() => mockClient),
		Prisma: {},
	};
});
