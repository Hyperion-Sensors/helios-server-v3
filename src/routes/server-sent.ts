/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this

/*----------------------------------------------Custom Imports------------------------------------------ */
import {get_most_recent_asset} from '../services/temp_services/asset_temps_service';

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*-----------------------------------------------Main Logic------------------------------------------------- */

router.get('/live-asset', async (req: Request, res: Response) => {
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders(); // flush the headers to establish SSE with client

	let counter = 0;
	const interValID = setInterval(async () => {
		counter++;
		// eslint-disable-next-line
		const result: any = await get_most_recent_asset(Number(req.query.assetID));
		if (counter >= 10) {
			clearInterval(interValID);
			res.end(); // terminates SSE session
			return;
		}

		res.write(`data: ${JSON.stringify(result)}\n\n`); // res.write() instead of res.send()
	}, 1000);

	// If client closes connection, stop sending events
	res.on('close', () => {
		// eslint-disable-next-line
		console.log('client dropped server connection');

		clearInterval(interValID);
		res.end();
	});
});

export default router;
