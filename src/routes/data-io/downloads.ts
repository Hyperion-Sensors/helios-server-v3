/*----------------------------------Library Imports-------------------------------------- */
import express, {Router} from 'express'; //always need this

/*----------------------------------------Custom Imports------------------------------------- */

import {
	trial_data,
	get_downloadable_asset_temps,
	get_all_downloadable_asset_temps,
	get_downloadable_fiber_temps,
	get_all_systems,
	get_downloadable_assets,
} from '../../services/file_services/downloads';
import {
	generate_csv_local,
	download_response,
} from '../../utils/helper_services/file_handler';
/*-------------------------------------App Configuration--------------------------------------- */
const router: Router = express.Router(); //always need this

/*-----------------------------------------Type Imports---------------------------------------- */
import fs from 'fs';
/*------------------------------------------Routes--------------------------------------------- */

// GET /assets-download -> retreives all assets and relevant information
router.get('/asset-info-data', async (req, res) => {
	try {
		const asset_data = await get_downloadable_assets();
		// console.log(asset_data);
		//generate csv file and record id
		const fileID = await generate_csv_local(asset_data as Array<any>);
		// Send the CSV as a downloadable file
		await download_response(res, `./saved_data/data_${fileID}.csv`);
	} catch (error) {
		res.status(500).json({error: 'Server error'});
	}
});

// GET /assets-download -> retreives all assets and relevant information
router.post('/asset-agg-data', async (req, res) => {
	try {
		const asset_data = await get_downloadable_asset_temps(
			req.body.asset_names as Array<string>,
			req.body.start_date as string,
			req.body.end_date as string,
			req.body.imperial as boolean
		);
		//generate csv file and record id
		const fileID = await generate_csv_local(asset_data as Array<any>);

		// Send the CSV as a downloadable file
		await download_response(res, `./saved_data/data_${fileID}.csv`);
	} catch (error) {
		res.status(500).json({error: 'Server error'});
	}
});

// GET /assets-download -> retreives all assets and relevant information
router.post('/all-agg-data', async (req, res) => {
	try {
		const asset_data = await get_all_downloadable_asset_temps(
			req.body.start_date as string,
			req.body.end_date as string,
			req.body.imperial as boolean
		);
		//generate csv file and record id
		const fileID = await generate_csv_local(asset_data as Array<any>);

		// Send the CSV as a downloadable file
		await download_response(res, `./saved_data/data_${fileID}.csv`);
	} catch (error) {
		res.status(500).json({error: 'Server error'});
	}
});

// GET /assets-download -> retrieves all assets and relevant information
router.post('/fiber-temp-data', async (req, res) => {
	try {
		const asset_data = await get_downloadable_fiber_temps(
			req.body.asset_names as Array<string>,
			req.body.start_date as string,
			req.body.end_date as string,
			req.body.imperial as boolean
		);
		//generate csv file and record id
		const fileID = await generate_csv_local(asset_data as Array<any>);

		// Send the CSV as a downloadable file
		await download_response(res, `./saved_data/data_${fileID}.csv`);
	} catch (error) {
		res.status(500).json({error: 'Server error'});
	}
});

// GET /all-systems -> retreives all assets and relevant information
router.get('/all-systems', async (req, res) => {
	try {
		const asset_data = await get_all_systems();
		//generate csv file and record id
		const fileID = await generate_csv_local(asset_data as Array<any>);

		// Send the CSV as a downloadable file
		await download_response(res, `./saved_data/data_${fileID}.csv`);
	} catch (error) {
		res.status(500).json({error: 'Server error'});
	}
});

// GET /trial-download -> retreives all fibers for a given asset
router.get('/trial-download', async (req, res) => {
	try {
		//generate csv file and record id
		const fileID = await generate_csv_local(trial_data);

		// Send the CSV as a downloadable file
		res.download(
			`./saved_data/data_${fileID}.csv`,
			`./saved_data/data_${fileID}.csv` + fileID,
			(error) => {
				if (error) {
					console.error('Error downloading CSV', error);
				} else {
					// Delete the file after sending
					fs.unlink('data.csv', () => {
						if (error) {
							console.error('Error deleting file', error);
						}
					});
				}
			}
		);
	} catch (error) {
		res.status(500).json({error: 'Server error'});
	}
});

export default router;
