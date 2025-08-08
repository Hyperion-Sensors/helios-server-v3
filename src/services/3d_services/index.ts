import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient({log: ['query']});

/*---------------------------------------------------Type Imports--------------------------------------------------- */
import config from '@/Types/3d_types';

export async function get_config(asset_name: string): Promise<config | null> {
	try {
		const result = await prisma.three_d_model.findFirst({
			where: {
				asset: {
					name: {
						equals: asset_name,
					},
				},
			},
			select: {
				fibers: true,
				accessories: true,
				scale: true,
				asset: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return {
		fibers: [],
		accessories: [],
		scale: null,
		asset: {
			id: null,
			name: '',
		},
	};
}
export async function get_dup(asset_name: string): Promise<config | null> {
	try {
		const result = await prisma.three_d_model.findFirst({
			where: {
				asset: {
					name: {
						equals: asset_name,
					},
				},
			},
			select: {
				fibers: true,
				accessories: true,
				scale: true,
				asset: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return result;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
	return {
		fibers: [],
		accessories: [],
		scale: null,
		asset: {
			id: null,
			name: '',
		},
	};
}
