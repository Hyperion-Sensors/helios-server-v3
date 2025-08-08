/*-------------------------------Library Imports----------------------------------- */
import {Prisma, PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

/*-------------------------------Meta Data----------------------------------- */
import * as default_settings from './default_settings.json';

/*-------------------------------Helpers & Types----------------------------------- */
import {
	hasSingleKeyValuePair,
	validateJsonAttributes,
	mutateSettings,
} from './settings-helpers';
import {
	settings,
	general,
	data_options,
} from '../../utils/types/settings_types';

/*-------------------------------Logic----------------------------------- */
/* Function: getUserSettings

Purpose: Retrieves all general settings for a specified user
*/
export async function getUserSettings(user_id: string) {
	//Get either the earliest or latest temperature points available
	try {
		const settings = await prisma.user_settings.findUnique({
			where: {
				user_id: user_id,
			},
		});

		return settings;
	} catch (err) {
		console.log(err); // eslint-disable-line
	}
}

/*------------------------------------------------------------------ */

/*
Function: updateSingleSetting

Purpose: Updates an individual setting for a user
*/
export async function updateSingleSetting(
	user_id: string,
	setting_type: string,
	user_input: {[key: string]: unknown}
) {
	try {
		//get settings for a specific user_id
		const userSettings = await prisma.user_settings.findUnique({
			where: {
				user_id: user_id,
			},
			select: {
				settings: true,
				saved_at: true,
			},
		});

		if (
			userSettings !== null ||
			(undefined && typeof userSettings == 'object' && user_input !== null) ||
			undefined
		) {
			if (hasSingleKeyValuePair(user_input)) {
				/*Set up original settings variable as well as general and data_options for mutations to settings */
				const settings = userSettings?.settings as unknown as settings;
				const general = settings.general as unknown as general;
				const data_options = settings.data_options as unknown as data_options;

				const processedSettings: Prisma.JsonObject = mutateSettings(
					setting_type,
					user_input,
					settings,
					general,
					data_options
				) as settings as unknown as Prisma.JsonObject;

				// Update the settings for the user
				await prisma.user_settings.update({
					where: {
						user_id: user_id,
					},
					data: {
						settings: processedSettings,
					},
				});
			} else {
				throw new Error(`Invalid type: ${setting_type}`);
			}

			// http://localhost:8000/helios-server/settings/general/change-settings/5599837b-fda5-4725-9708-dc93118663d0
			return true;
		} else {
			return false;
		}
	} catch (err) {
		console.log(err); // eslint-disable-line
		return false;
	}
}

/*------------------------------------------------------------------ */

/*
Function: updateUserSettings

Purpose: Updates an individual settings for a user
*/

const defaults: settings = default_settings.settings;

export async function updateMultipleSettings(
	user_id: string,
	setting_type: string,
	user_input: {[key: string]: unknown}
) {
	try {
		//get settings for a specific user_id
		if (
			validateJsonAttributes(
				user_input,
				defaults[`${setting_type == 'general' ? 'general' : 'data_options'}`]
			)
		) {
			const userSettings = await prisma.user_settings.findUnique({
				where: {
					user_id: user_id,
				},
				select: {
					settings: true,
					saved_at: true,
				},
			});

			if (
				userSettings !== null ||
				(undefined && user_input !== null) ||
				undefined
			) {
				const settings = userSettings?.settings as unknown as settings;
				const general = settings.general as unknown as general;
				const data_options = settings.data_options as unknown as data_options;

				const processedSettings: Prisma.JsonObject = mutateSettings(
					setting_type,
					user_input,
					settings,
					general,
					data_options
				) as settings as unknown as Prisma.JsonObject;

				// Update the settings for the user
				await prisma.user_settings.update({
					where: {
						user_id: user_id,
					},
					data: {
						settings: processedSettings, //use the spread of the processed settings
					},
				});
			} else {
				return false;
			}
		} else {
			return false;
		}
		// http://localhost:8000/helios-server/settings/general/change-settings/5599837b-fda5-4725-9708-dc93118663d0
		return true;
	} catch (err) {
		console.log(err); // eslint-disable-line
		return false;
	}
}

/*---------------------------------------------------------------------- */

/*
Function: createSettings

Purpose: Creates a new settings entry for a user
*/
export async function createSettings(user_id: string) {
	try {
		const updateStatus = await prisma.user_settings.create({
			data: {
				user_id: user_id,
				settings: default_settings.settings,
			},
		});
		return updateStatus ? true : false;
	} catch (err) {
		console.log(err); // eslint-disable-line
		return false;
	}
}

/*---------------------------------------------------------------------- */
/*
Function: deleteSettings

Purpose: Deletes a single specific setting from a user. This will not affect helios as it will 
regenerate the settings for the user if they are not present. This service is meant
 for testing purposes.

 Example Input:
 {
  {
    "settings_key": "data_options",
    "delete_key": "Bad_setting_to_delete"
}
 }
*/

export async function deleteSetting(
	user_id: string,
	delete_key: string,
	settings_key?: string | null | undefined
) {
	try {
		const userSettings = await prisma.user_settings.findUnique({
			where: {
				user_id: user_id,
			},
			select: {
				settings: true,
				saved_at: true,
			},
		});
		//prettier why?..................
		if (
			userSettings !== null ||
			(undefined && delete_key !== null) ||
			undefined
		) {
			/*eslint-disable*/
			const settings = userSettings?.settings as unknown as Record<string, any>;
			/*eslint-enable*/

			if (
				settings_key !== null &&
				settings_key !== undefined &&
				settings != null
			) {
				delete settings[settings_key][delete_key];
				await prisma.user_settings.update({
					where: {
						user_id: user_id,
					},
					data: {
						settings: {
							...settings,
						},
					},
				});
			} else {
				delete settings[delete_key];
				await prisma.user_settings.update({
					where: {
						user_id: user_id,
					},
					data: {
						settings: {
							...settings,
						},
					},
				});
			}
			return true;
		} else {
			return false;
		}
	} catch (err) {
		console.log(err); // eslint-disable-line
		return false;
	}
}
