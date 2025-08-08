/*--------------------------------------Library Imports------------------------------------- */
import express, {Router} from 'express';

/*---------------------------------------Custom Imports-------------------------------------- */
// (1) Add exports from ../routes/* to import sub routers

import temps from '../routes/temps';
import caps from '../routes/caps';
import devices from '../routes/devices';
import assets from '../routes/assets';
import notifications from '../routes/notifications';
import threeD from '../routes/3d';
import serverSent from '../routes/server-sent';
import fiber from '../routes/fiber';
import settings from '../routes/settings';
import files from '../routes/data-io/files';
import downloads from '../routes/data-io/downloads';
import io from '../routes/data-io/data_io';

/*----------------------------------App Configuration----------------------------------------- */
const router: Router = express.Router();

/*-------------------------------------------Main Logic----------------------------------------- */
// (2) Add new routers below
router.use('/temps', temps);
router.use('/caps', caps);
router.use('/devices', devices);
router.use('/assets', assets);
router.use('/notifications', notifications);
router.use('/3d', threeD);
router.use('/server-sent', serverSent);
router.use('/fiber', fiber);
router.use('/settings', settings);
router.use('/files', files);
router.use('/downloads', downloads);
router.use('/io', io);

export default router;
