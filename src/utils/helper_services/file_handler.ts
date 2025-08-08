/*---------------------------------------Library Imports-------------------------------------- */
import {v4 as uuidv4} from 'uuid';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
import fs from 'fs';
import {Response} from 'express';
/*-----------------------------------------------------------------------
Generate a csv file with the name data_<fileID>.csv.

Returns: Filename of the generated csv file
----------------------------------------------------------------------------*/
export async function generate_csv_local(
	data: Array<any>,
	location = './saved_data',
	fileID: string = uuidv4() // this fileID can be overridden if necessary
) {
	// Define the headers based on the keys in the data objects
	const headers = Object.keys(data[0]);

	// Filter and transform data as needed (e.g., excluding "coordinates")
	const filteredData = data.map((item) => {
		const {coordinates, ...rest} = item;
		return rest;
	});

	// Create a CSV file with uuid. When multiple files are created, they will not overwrite each other.
	const csvWriter = createCsvWriter({
		path: `${location}/data_${fileID}.csv`,
		fileID,
		header: headers.map((header) => ({id: header, title: header})),
	});

	// Write the data to the CSV file, and wait for the operation to complete
	await csvWriter.writeRecords(filteredData);

	return fileID;
}

/*-----------------------------------------------------------------------
Generate a csv file with the name data_<fileID>.csv and writes it to s3.

Returns: Filename of the generated csv file
----------------------------------------------------------------------------*/
function generate_csv_s3(data: Array<any>) {
	// Define the headers based on the keys in the data objects
	const headers = Object.keys(data[0]);

	// Filter and transform data as needed (e.g., excluding "coordinates")
	const filteredData = data.map((item) => {
		const {coordinates, ...rest} = item;
		return rest;
	});

	// Create a CSV file with uuid. When multiple files are created, they will not overwrite each other.
	const csvWriter = createCsvWriter({
		path: `data_${uuidv4()}.csv`,
		header: headers.map((header) => ({id: header, title: header})),
	});

	// WRITE FILE TO s3 then DELETE THE FILE...

	return 'done';
}

/*-----------------------------------------------------------------------
Download response boilerplate code.

Returns: res.status()
----------------------------------------------------------------------------*/
export async function download_response(res: Response, fileName: string) {
	// Send the CSV as a downloadable file
	res.download(fileName, (error) => {
		if (error) {
			console.error('Error downloading CSV', error);
		} else {
			// Delete the file after sending
			fs.unlink(fileName, () => {
				if (error) {
					console.error('Error deleting file', error);
				}
			});
		}
	});
}
