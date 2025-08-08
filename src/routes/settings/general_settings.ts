/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this

/*----------------------------------------------Custom Imports------------------------------------------ */

import {
	getUserSettings,
	updateSingleSetting,
	updateMultipleSettings,
	createSettings,
	deleteSetting,
} from '../../services/settings_services/general_settings';
/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*---------------------------------------------------Type Imports--------------------------------------------------- */
import {user_settings} from '../../utils/types/settings_types';

/*-----------------------------------------------Routes------------------------------------------------- */

// GET /user/settings -> retrieves all general settings for a specified user
router.get('/user', async (req: Request, res: Response) => {
	const user_id = req.query.sub;
	if (typeof user_id === 'string') {
		const result = await getUserSettings(user_id);
		const settings: user_settings | unknown = result?.settings; //get settings object from result
		const time_saved: Date | unknown = result?.saved_at; //get time_saved from result
		if (result === null) {
			res.status(204).send('Invalid user id'); // No Content
		} else {
			res.send({settings: settings, saved_at: time_saved});
		}
	} else {
		res.status(400);
		return;
	}
});

// Patch /user/change-single -> sets single setting for a specified user
router.patch(
	'/change-single/:id/:settingType',
	async (req: Request, res: Response) => {
		const user_id = req.params.id;
		const settingType = req.params.settingType; //type of setting (general or data_options)
		const target_attribute = req.body; // Extract the attribute name and value from the request body

		// const { attributeName, attributeValue } = req.body; // Extract the attribute name and value from the request body
		if (typeof user_id === 'string') {
			const updateStatus = await updateSingleSetting(
				user_id,
				settingType,
				target_attribute
			); //call update method and set update status
			if (updateStatus == true) {
				res.status(200);
				res.send('Settings updated');
			} else {
				res.send('Settings not updated');
				res.status(304);
			}
		} else {
			res.send('Invalid user id');
			return;
		}
	}
);

// Patch /user/change-multi/:id -> sets multiple settings for a specified user
router.patch(
	'/change-multi/:id/:settingType',
	async (req: Request, res: Response) => {
		const user_id = req.params.id;
		const settingType = req.params.settingType; //type of setting (general or data_options)
		const target_attribute = req.body; // Extract the attribute name and value from the request body
		// const { attributeName, attributeValue } = req.body; // Extract the attribute name and value from the request body
		if (typeof user_id === 'string') {
			const updateStatus = await updateMultipleSettings(
				user_id,
				settingType,
				target_attribute
			); //call update method and set update status
			if (updateStatus == true) {
				res.status(200);
				res.send('Settings updated');
			} else {
				res.send('Settings not updated');
				res.status(304);
			}
		} else {
			res.send('Invalid user id');
			res.status(401);

			return;
		}
	}
);

// PATCH /user/remove-setting/:id -> removes a setting either nested or not nested
router.patch('/remove-setting/:id', async (req: Request, res: Response) => {
	const user_id: string = req.params.id;
	const settings_key: string | null | undefined = req.body.settings_key; // Extract the attribute name and value from the request body
	const delete_key: string = req.body.delete_key;
	// const { attributeName, attributeValue } = req.body; // Extract the attribute name and value from the request body
	if (typeof user_id === 'string') {
		const updateStatus = await deleteSetting(user_id, delete_key, settings_key); //call update method and set update status
		if (updateStatus == true) {
			res.status(200);
			res.send('Settings updated');
		} else {
			res.send('Settings not updated');
			res.status(304);
		}
	} else {
		res.send('Invalid user id');
		res.status(401);

		return;
	}
});

// POST /user/create-user -> creates a user settings  for a specified user
router.post('/create-user', async (req: Request, res: Response) => {
	const user_id = req.body.user_id;

	// const { attributeName, attributeValue } = req.body; // Extract the attribute name and value from the request body
	if (typeof user_id === 'string') {
		const updated_record_status: boolean | unknown = await createSettings(
			user_id
		);
		if (updated_record_status == true) {
			res.send("User's settings created");
			res.status(201);
		} else {
			res.send("User's settings not created, user may already exist");
			res.status(304);
		}
	} else {
		res.send('Invalid user id');
		res.status(401);
		return;
	}
});

export default router;
