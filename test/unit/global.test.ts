import {Asset} from '@/Types/asset_types';
import {get_all_assets} from '../../src/services/asset_services';

describe('Testing routes for global data: ', () => {
	jest.setTimeout(30000);

	/*---------------------------------------------Get /latest------------------------------------------------- */
	describe('FUNCTION: **get_assets**', () => {
		it('Should return all assets: ', async () => {
			const result: unknown = await get_all_assets();
			const typed_result = result as Asset[];
			if (result) {
				expect(typed_result[0].name).toEqual('Oven_Demo');
			}
		});
	});
});
