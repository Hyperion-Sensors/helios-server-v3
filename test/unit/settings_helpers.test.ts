import {
	hasSingleKeyValuePair,
	validateJsonAttributes,
	mutateSettings,
} from '../../src/services/settings_services/settings-helpers';

describe('settings-helpers', () => {
	describe('hasSingleKeyValuePair', () => {
		it('returns true when only one key-value pair is present', () => {
			expect(hasSingleKeyValuePair({Theme: 'dark'})).toBe(true);
		});

		it('returns false when multiple pairs are present', () => {
			expect(hasSingleKeyValuePair({Theme: 'dark', Units: 'metric'})).toBe(
				false
			);
		});
	});

	describe('validateJsonAttributes', () => {
		it('returns true when all keys in B exist in A', () => {
			const A = {Theme: 'dark', Units: 'metric'};
			const B = {Theme: 'light'};
			expect(validateJsonAttributes(B, A)).toBe(true);
		});

		it("returns false when B has keys that aren't in A", () => {
			const A = {Theme: 'dark'};
			const B = {Units: 'imperial'};
			expect(validateJsonAttributes(B, A)).toBe(false);
		});
	});

  describe('mutateSettings', () => {
    const origin_settings = {
      general: {
        Theme: 'dark',
        Color_Blind_Mode: false,
        Side_Panel_Default: true,
      },
      data_options: {
        Pinned_Assets: [],
        Favorite_Widgets: [],
        Data_Refresh_Rate: 30,
        Unit_System: 'metric',
      },
    };

		it('mutates general settings when settings_type is general', () => {
			const updated = mutateSettings(
				'general',
				{Theme: 'light'},
				origin_settings,
				origin_settings.general,
				origin_settings.data_options
			) as any;

			expect(updated.general.Theme).toBe('light');
      expect(updated.general.Color_Blind_Mode).toBe(false);
      expect(updated.general.Side_Panel_Default).toBe(true);
      expect(updated.data_options).toEqual(origin_settings.data_options);
		});

		it('mutates data options when settings_type is data-options', () => {
      const updated = mutateSettings(
        'data-options',
        {Data_Refresh_Rate: 15},
				origin_settings,
				origin_settings.general,
				origin_settings.data_options
			) as any;

      expect(updated.data_options.Data_Refresh_Rate).toBe(15);
			expect(updated.general).toEqual(origin_settings.general);
		});

		it('throws on invalid settings_type', () => {
			expect(() =>
				mutateSettings(
					'invalid',
					{Theme: 'light'},
					origin_settings,
					origin_settings.general,
					origin_settings.data_options
				)
			).toThrow('Invalid type: invalid');
		});
	});
});
