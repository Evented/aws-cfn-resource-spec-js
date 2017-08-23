import fs from 'fs';
import https from 'https';
import zlib from 'zlib';

const url = 'https://dnwj8swjjbsbt.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json';

if (!fs.existsSync('./build')) {
	fs.mkdirSync('./build')
}

https.get(url).on('response', (response) => {
	const {statusCode} = response;

	if (statusCode < 200 || statusCode > 299) {
		console.error('Invalid HTTP status code');
		process.exit(1);
	}

	const output = fs.createWriteStream('./build/spec.json');
	let res = response;

	switch (response.headers['content-encoding']) {
		case 'gzip':
		case 'deflate':
			res = res.pipe(zlib.createUnzip());
		default:
			res.pipe(output);
	}
});
