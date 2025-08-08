/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this

/*-----------------------------------Custom Imports---------------------------- */
import {
	get_range_temps,
	get_range_temps_aggregate,
	get_last_day_fiber,
} from '../../services/temp_services/fiber_temps_services';
import get_segment_temps from '../../services/temp_services/segment_temps_service';
/*-----------------------------App Configuration------------------------------ */
const router: Router = express.Router(); //always need this

/*-------------------------------Routes------------------------------------ */

router.post('/range', async (req: Request, res: Response) => {
	const start: number = req.body.start;
	const end: number = req.body.end;
	const tfit_table: string = req.body.tfit;

	const result = await get_range_temps(start, end, tfit_table);
	res.send(result);
});

// Route to access segmented temperatures
router.post('/segment', async (req: Request, res: Response) => {
	const asset_id: number = req.body.asset_id;
	const tfit_table: string = req.body.raw_table;
	const settings_table: string = req.body.settings_table;
	const imperial: boolean | undefined = req.body.imperial;

	const result =
		imperial != undefined
			? await get_segment_temps(asset_id, tfit_table, settings_table, imperial)
			: await get_segment_temps(asset_id, tfit_table, settings_table);

	res.send(result);
});

router.post('/aggregate', async (req: Request, res: Response) => {
	const result = await get_last_day_fiber(
		req.body.bucket_type,
		req.body.bucket_number,
		req.body.fiber_name
	);
	res.send(result);
});

router.post('/range-aggregate', async (req: Request, res: Response) => {
	const aggregate_type: string = req.body.aggregate_type;
	const fiber_id: number = req.body.fiber_id;
	const interval: string = req.body.interval;
	const start: string = req.body.start;
	const end: string = req.body.end;
	const result = await get_range_temps_aggregate(
		aggregate_type,
		fiber_id,
		interval,
		start,
		end
	);
	res.send(result);
});

export default router;
