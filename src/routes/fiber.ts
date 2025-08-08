/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {NextFunction, Request, Response, Router} from 'express'; //always need this

/*----------------------------------------------Custom Imports------------------------------------------ */
// import {getEdge, getRange} from "../services/temperature_services"; //import custom business logic from ../service

import {get_fibers} from '../services/asset_services';

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*---------------------------------------------------Type Imports--------------------------------------------------- */

/*-----------------------------------------------Routes------------------------------------------------- */

// Temporary route, will be removed and become part of get all assets
// GET /fibers -> retreives all fibers for a given asset
router.get(
	'/fibers',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const asset_id = Number(req.query.asset_id); //get asset id from query

			const response = await get_fibers(asset_id);
			res.send(response);
		} catch (err) {
			next(err);
		}
	}
);

export default router;
