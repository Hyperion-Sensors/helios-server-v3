/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this

/*----------------------------------------------Custom Imports------------------------------------------ */
import {get_config} from '../services/3d_services'; //import custom business logic from ../service

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this
/*---------------------------------------------------Type Imports--------------------------------------------------- */
import config from '@/Types/3d_types';
/*-----------------------------------------------Routes------------------------------------------------- */

// POST /config -> retreives the config information about glb file
router.post('/config', async (req: Request, res: Response) => {
	const asset_name: string = req.body.asset_name;

	const result: config | null = await get_config(asset_name);
	res.send(result);
});

export default router;
