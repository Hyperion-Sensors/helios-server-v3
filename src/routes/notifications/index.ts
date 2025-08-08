/*-----------------------------------------------Library Imports------------------------------------------------- */

import express, {Request, Response, Router} from 'express'; //always need this

/*----------------------------------------------Custom Imports------------------------------------------ */
// import {getEdge, getRange} from "../services/temperature_services"; //import custom business logic from ../service
import {
	get_all_notifications,
	get_recent_notifications,
} from '../../services/notification_services';

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*-----------------------------------------------Routes------------------------------------------------- */
router.get('/all', async (req: Request, res: Response) => {
	const result = await get_all_notifications();
	res.send(result);
});

router.get('/recent', async (req: Request, res: Response) => {
	const result = await get_recent_notifications();
	res.send(result);
});

export default router;
