/*-----------------------------------------------Library Imports------------------------------------------------- */
import express from 'express';
/*-----------------------------------------------App Configuration------------------------------------------------- */
const router = express.Router();

/*-----------------------------Sub-router Imports--------------------------- */
import general from './general_settings';

/*---------------------------------Sub-router Setup----------------------------- */
router.use('/general', general);

export default router;
