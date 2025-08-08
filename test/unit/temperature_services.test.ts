import {getRange} from '../../src/services/temp_services';

describe('Testing temperature functions for helios-server:', () => {
	interface Range {
		time_bin: string;
		count: string;
	}

	describe('FUNCTION: **getRange**', () => {
		it('Should return time_bin array: ', async () => {
			const result = await getRange();

			if (result) {
				expect(result[0]).toEqual<Range>({
					time_bin: expect.any(String),
					count: expect.any(String),
				});
			}
		});
	});
});
