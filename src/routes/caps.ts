/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this

/*----------------------------------------------Custom Imports------------------------------------------ */
import {
	latest_capacity_values,
	hour_aggregate,
	recent_load,
	recent_capacity,
} from '../services/capacity_services'; //import custom business logic from ../service
// import latest from '../services/load_services';

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*-----------------------------------------------Main Logic------------------------------------------------- */
router.get('/most-recent', async (req: Request, res: Response) => {
	const result = await latest_capacity_values();
	if (result) {
		res.send(result);
	} else {
		res.send(501);
	}
});

router.get('/capacity-hour-aggregate', async (req: Request, res: Response) => {
	const result = await hour_aggregate(Number(req.params.time_interval));
	if (result) {
		res.send(result);
	} else {
		res.send(501);
	}
});

router.get('/recent-capacity', async (req: Request, res: Response) => {
	const result = await recent_capacity(
		Number(req.query.asset_id),
		Number(req.query.limit)
	);
	res.send(result);
});

router.get('/recent-load', async (req: Request, res: Response) => {
	const result = await recent_load(
		Number(req.query.asset_id),
		Number(req.query.limit)
	);
	res.send(result);
});
// // GET /latest -> gets latest datapoint available in database
// router.get('/latest', async (req: Request, res: Response) => {
//   const greeting = await latest();
//   res.send(greeting);
// });

export default router;
