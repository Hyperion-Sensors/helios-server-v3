/*-----------------------------Library Imports-------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this
import {v4 as uuidv4} from 'uuid';

/*-----------------------------------Custom Imports---------------------------- */
// import {getEdge, getRange} from "../services/temperature_services"; //import custom business logic from ../service
import {
	get_last_day_asset,
	get_most_recent_asset,
	get_max_fiber,
	get_hot_assets,
	get_between_times,
} from '../../services/temp_services/asset_temps_service';
/*-----------------------------App Configuration------------------------------ */
const router: Router = express.Router(); //always need this

/*--------------------------------Type Imports------------------------------- */
// import {Filter, Asset} from '@/Types/asset_types';

/*-------------------------------Routes------------------------------------ */
// GET /all -> gets all assets and relevant information
router.get('/', async (req: Request, res: Response) => {
	res.send('yesssir');
});

router.post('/aggregate', async (req: Request, res: Response) => {
	const result = await get_last_day_asset(
		req.body.bucket_type,
		req.body.bucket_number,
		req.body.asset_number
	);
	res.send(result);
});

router.post('/range-aggregate', async (req: Request, res: Response) => {
	const result = await get_between_times(
		req.body.asset_id,
		req.body.start_date,
		req.body.end_date
	);
	res.send(result);
});

//GET -> sends most recent temperature rows for each fiber in an asset
router.get('/most-recent-temps', async (req: Request, res: Response) => {
	const asset_id = Number(req.query.id);
	const response = await get_most_recent_asset(asset_id);
	/*es-lint enable */

	res.send(response);
});

//POST -> sends the fiber with the highest temperature in an asset
router.post('/highest-temperature', async (req: Request, res: Response) => {
	const asset_id: number = req.body.asset_id;
	const response = await get_max_fiber(asset_id);
	res.send(response);
});

// GET -> sends the assets with an average temperature above a certain threshold
router.post(`/hot-assets`, async (req: Request, res: Response) => {
	const startDate: string = req.body.startDate;
	const response = await get_hot_assets(startDate);
	res.send(response);
});

export default router;
