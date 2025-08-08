import {
	PutObjectCommand,
	S3Client,
	ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// No other services require S3Client atm, so we can just create it here
// This can be moved and exported during future reorganisation

const client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
});

export async function uploadDataFile(file: Express.Multer.File) {
	const command = new PutObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: file.originalname, // NEED TO CHANGE FOR SECURITY
		Body: file.buffer,
	});

	try {
		const response = await client.send(command);
		return response;
	} catch (err) {
		return err;
	}
}

export async function getFileNames() {
	const command = new ListObjectsV2Command({
		Bucket: process.env.AWS_S3_BUCKET_NAME,
	});

	try {
		const response = await client.send(command);
		return response;
	} catch (err) {
		return err;
	}
}
