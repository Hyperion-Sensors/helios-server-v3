/*----------------------------------Library Imports-------------------------------------- */
import express, {Router} from 'express'; //always need this

/*----------------------------------------Custom Imports------------------------------------- */

import {put_sensor_data} from '../../services/real-time/data_input';
import {
	generate_csv_local,
	download_response,
} from '../../utils/helper_services/file_handler';
import moment from 'moment';
/*-------------------------------------App Configuration--------------------------------------- */
const router: Router = express.Router(); //always need this

/*-----------------------------------------Type Imports---------------------------------------- */
/*------------------------------------------Routes--------------------------------------------- */

// GET /assets-download -> retrieves all assets and relevant information
router.put('/fiber-temp-data', async (req, res) => {
	console.log([
		req.body.tfit,
		req.body.settings_id,
		moment(req.body.date).toDate(),
		req.body.frequency_mhz,
		req.body.temp_celcius,
		req.body.strain,
	]);
	try {
		const asset_data = await put_sensor_data(
			req.body.tfit as string,
			req.body.settings_id as number,
			moment(req.body.date).toDate(),
			req.body.frequency_mhz as Array<number>,
			req.body.temp_celcius as Array<number>,
			req.body.strain as Array<number>
		);

		// Send the CSV as a downloadable file
		res.json({data: asset_data});
	} catch (error) {
		console.log(error);
		res.status(500).json({error: 'Server error'});
	}
});

export default router;
