// ogAuthor: H.Ossias

/*-------------------------------Types--------------------------------- */
import {data_options, general} from '@/Types/settings_types';

/*---------------------------------------------------------------------- */

/*
Function: hasSingleKeyValuePair

Purpose: Validates that a JSON object has only one key-value pair
*/
export function hasSingleKeyValuePair(jsonObject: {[key: string]: unknown}) {
	// Get the keys of the JSON object
	const keys = Object.keys(jsonObject);

	// Check if there is only one key-value pair
	return keys.length === 1;
}

/*---------------------------------------------------------------------- */

/*
Function: validateJsonAttributes

Purpose: Validates that all attributes held in object B are present in object A
*/
export function validateJsonAttributes(B: object, A: object) {
	// Get the keys of JSON objects B and A
	const keysB = Object.keys(B);
	const keysA = Object.keys(A);

	// Check if all attribute keys in B are present in A
	return keysB.every((key) => keysA.includes(key));
}

/*---------------------------------------------------------------------- */

/*
Function: mutateSettings

Purpose: Replaces portions of settings as directed by user_input and settings_type
*/
export function mutateSettings<settings>(
	settings_type: string,
	user_input: object,
	origin_settings: settings,
	general: general,
	data_options: data_options
) {
	/*Based on settings type as defined by the user, mutate a single settings given in user_input */
	if (settings_type === 'general') {
		// Update the 'general' settings

		return {
			...{
				...origin_settings, // 1. copy contents of original settings
				general: {
					// 2. replace general with new settings
					...general, // 3. copy contents of original general
					...user_input, // 4. replace single setting as defined by user_input
				},
			},
		};
	} else if (settings_type === 'data-options') {
		//same as above with data_options
		return {
			...origin_settings,
			data_options: {
				...data_options,
				...user_input,
			},
		};
	} else {
		throw new Error(`Invalid type: ${settings_type}`);
	}
}
