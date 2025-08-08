/*---------------------------------------Library Imports---------------------------------------- */
import express, {Express, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';

/*----------------------------------------------Custom Imports------------------------------------------ */
import router from './src/controllers/main_router';

/*-----------------------------------------------App Configuration------------------------------------------------- */

dotenv.config();
const app: Express = express(); // constant app is of type FUNCTION and returns an instance of EXPRESS functionality
const port = process.env.PORT;

/*-----------------------------------------------Middleware------------------------------------------------- */

app.use(express.json());

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

const allowedOrigins = [
	'http://3.96.147.224:3000',
	'http://localhost:3000',
	'https://test-build.d2lx6wvh935aed.amplifyapp.com',
];

app.use(
	cors({
		origin: allowedOrigins,
	})
);

app.use(express.urlencoded({extended: true}));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err) {
		/* eslint-disable no-console */
		console.log(err);
		res.status(500).json({error: 'Internal server error'});
	} else {
		next();
	}
});

/*------------------------Route Lister-----------------------*/

/*-----------------------------------------------Main Logic------------------------------------------------- */

app.get('/', (req: Request, res: Response) => {
	res.send(
		'You have accessed helios-server. Typescript and Expressed based REST-API'
	);
});

app.use('/helios-server', router);

if (process.env.NODE_ENV !== 'test') {
	try {
		app.listen(port, () => {
			/*eslint-disable-line*/ console.log(
				`~~HELIOS-SERVER STARTED ON http://localhost:${process.env.PORT}~~`
			);
		});
	} catch (e) {
		if (e instanceof Error) {
			console.log(`Error occurred: ${e.message}`); // eslint-disable-line
		}
	}
}

process.on('SIGINT', function () {
	console.log('\nGracefully shutting down from SIGINT (Ctrl-C)'); // eslint-disable-line
	// some other closing procedures go here
	process.exit(0);
});

//@eslint-disable-next-line
console.log(listEndpoints(app));
/* eslint-enable no-console */

export default app;
