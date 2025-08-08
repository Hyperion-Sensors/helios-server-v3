/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this

/*----------------------------------------------Custom Imports------------------------------------------ */
// import {getEdge, getRange} from "../services/temperature_services"; //import custom business logic from ../service

import {
	get_all_assets,
	get_filtered_assets,
	get_by_asset_status,
	get_by_device_status,
	get_by_device,
	get_fibers,
} from '../../services/asset_services';

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*---------------------------------------------------Type Imports--------------------------------------------------- */
import {Filter} from '@/Types/asset_types';

/*-----------------------------------------------Routes------------------------------------------------- */
// GET /all -> gets all assets and relevant information
router.get('/all', async (req: Request, res: Response) => {
	const result = await get_all_assets();
	res.send(result);
});

// GET //active -> retreives all active assets and relevant information as filtered by filters object
router.get('/active', async (req: Request, res: Response) => {
	const result = await get_by_asset_status(Boolean(req.query.status)); //true for active, false for inactive
	res.send(result);
});

// GET //active -> retreives all active assets and relevant information as filtered by filters object
router.get('/tfit-status', async (req: Request, res: Response) => {
	const result = await get_by_device_status(Boolean(req.query.status)); //true for active, false for inactive
	res.send(result);
});

// // GET /inactive -> retreives all inactive assets and relevant information
// router.get('/inactive', async (req: Request, res: Response) => {
//   const result = await get_by_status(false);
//   res.send(result);
// });

// POST /filtered -> retreives all assets and relevant information as filtered by filters object
router.post('/filtered', async (req: Request, res: Response) => {
	const filter: Filter = req.body;

	const result = await get_filtered_assets(filter);
	res.send(result);
});

// POST /filtered -> retreives all assets and relevant information as filtered by filters object
router.post('/device', async (req: Request, res: Response) => {
	const tfit_id = req.body.tfit_id;

	const response = await get_by_device(tfit_id);
	res.send(response);
});

// Temporary route, will be removed and become part of get all assets
// POST /fibers -> retreives all fibers for a given asset
router.post('/fibers', async (req: Request, res: Response) => {
	const asset_id = req.body.asset_id;

	const response = await get_fibers(asset_id);
	res.send(response);
});

export default router;
