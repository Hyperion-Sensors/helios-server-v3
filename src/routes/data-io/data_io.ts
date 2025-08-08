/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this
import multer from 'multer';

/*----------------------------------------------Custom Imports------------------------------------------ */
import {add_raw_data, add_settings} from '../../services/real-time/temps';

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*-----------------------------------------------Types------------------------------------------------- */
type Result = {
	message: string;
	status: number;
};

/*-----------------------------------------------Routes------------------------------------------------- */

router.post('/upload_raw_data', async (req: Request, res: Response) => {
	const result: Result = (await add_raw_data(req.body)) as Result;
	res.status(result.status);
	res.send(result);
});

router.post('/upload_settings', async (req: Request, res: Response) => {
	const result: Result = (await add_settings(req.body)) as Result;
	res.status(result.status);
	res.send(result);
});

export default router;
