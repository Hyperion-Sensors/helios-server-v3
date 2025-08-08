/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this

/*----------------------------------------------Custom Imports------------------------------------------ */

import {
	get_all_tfits,
	get_all_regions,
	get_tfit_status,
	get_problem_fibers,
} from '../services/device_services';
/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*---------------------------------------------------Type Imports--------------------------------------------------- */
/*-----------------------------------------------Routes------------------------------------------------- */

// GET /inactive -> retreives all inactive assets and relevant information
router.get('/tfits', async (req: Request, res: Response) => {
	const result = await get_all_tfits();
	res.send(result);
});

// GET /regions -> retreives all tFIT installation regions
router.get('/regions', async (req: Request, res: Response) => {
	const result = await get_all_regions();
	res.send(result);
});

// POST /status -> retreives a specific tfit status with highest asset temperature
router.get('/status', async (req: Request, res: Response) => {
	const result = await get_tfit_status(Number(req.query.id));
	res.send(result);
});

// POST /status -> retreives a specific tfit status with highest asset temperature
router.get('/problem-fibers', async (req: Request, res: Response) => {
	const result = await get_problem_fibers();
	res.send(result);
});

export default router;
