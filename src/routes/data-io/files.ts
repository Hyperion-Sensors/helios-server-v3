/*-----------------------------------------------Library Imports------------------------------------------------- */
import express, {Request, Response, Router} from 'express'; //always need this
import multer from 'multer';

/*----------------------------------------------Custom Imports------------------------------------------ */
import {uploadDataFile, getFileNames} from '../../services/file_services';

/*-----------------------------------------------App Configuration------------------------------------------------- */
const router: Router = express.Router(); //always need this

/*-----------------------------------------------Routes------------------------------------------------- */
const upload = multer();

router.post(
	'/upload',
	upload.single('file'),
	async (req: Request, res: Response) => {
		if (!req.file) {
			res.status(400).send('No file uploaded.');
			return;
		} else if (
			!req.file.originalname.endsWith('.csv') ||
			req.file.mimetype !== 'text/csv'
		) {
			res.status(400).send('File must be a CSV.');
			return;
		}

		try {
			const result = await uploadDataFile(req.file);
			res.send(result);
		} catch (err) {
			res.send(err);
		}
	}
);

router.get('/get-all-names', async (req: Request, res: Response) => {
	try {
		const result = (await getFileNames()) as unknown as any;
		res.send(result.Contents);
	} catch (err) {
		res.send(err);
	}
});

export default router;
