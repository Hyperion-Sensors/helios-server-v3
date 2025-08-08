/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response} from 'express';

/*----------------------------------------------Custom Imports------------------------------------------ */
import {getEdge, getRange} from '../../services/temp_services'; //main logic in get()

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router = express.Router();

/*-----------------------------Sub-router Imports--------------------------- */
import assets from './asset_temps';
import fiber from './fiber_temps';

/*-----------------------------------------------Main Logic------------------------------------------------- */

// GET /latest -> gets latest datapoint available in database
router.get('/latest', async (req: Request, res: Response) => {
	const data = await getEdge(true);
	res.send(data);
});

// GET /earliest -> gets earliest datapoint available in database
router.get('/oldest', async (req: Request, res: Response) => {
	const data = await getEdge(false);
	res.send(data);
});

// POST /range -> retrieves temperature data over a period of time
router.get('/range', async (req: Request, res: Response) => {
	const data = await getRange();
	// start_time, end_time
	res.send(data);

	// res.send({ dead: 1 });
});

/*---------------------------------Sub-router Setup----------------------------- */
router.use('/assets', assets);
router.use('/fiber', fiber);

export default router;
