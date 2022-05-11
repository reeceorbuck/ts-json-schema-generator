import { createRequire } from 'https://deno.land/std@0.138.0/node/module.ts';
import url from 'https://deno.land/std@0.138.0/node/url.ts';
import { writeAll } from 'https://deno.land/std@0.138.0/streams/mod.ts';

const globalTypescript = '/opt/homebrew/lib/';
// TODO: this needs to be configurable for different OS and paths
const tempDirPath = Deno.env.get('TMPDIR');

try {
	await Deno.stat(url.pathToFileURL(`${tempDirPath}node_modules/typescript`));
	// console.log('Temp typescript module already exists, no need to fetch it again.');
} catch {
	console.log('Fetching Typescript dependency for caching...');
	const response = await fetch('https://github.com/reeceorbuck/typscriptModule/zipball/main');
	const blob = await response.blob();
	const buf = await blob.arrayBuffer();
	const data = new Uint8Array(buf);
	// We then create a new file and write into it
	const file = await Deno.create(url.pathToFileURL(`${tempDirPath}typescript.zip`));
	await writeAll(file, data);
	Deno.close(file.rid);

	const zipSourcePath = url.pathToFileURL(`${tempDirPath}typescript.zip`).pathname;
	const destinationPath = url.pathToFileURL(`${tempDirPath}node_modules`).pathname;

	const p = Deno.run({
		cmd: Deno.build.os === 'windows'
			? [
				'PowerShell',
				'Expand-Archive',
				'-Path',
				zipSourcePath,
				'-DestinationPath',
				destinationPath,
			]
			: ['unzip', zipSourcePath, '-d', destinationPath],
		stdout: 'piped',
		stderr: 'piped',
	});

	await Promise.all([
		p.status(),
		p.output(),
		p.stderrOutput(),
	]);
	p.close();

	await Deno.remove(url.pathToFileURL(`${tempDirPath}typescript.zip`));

	await Deno.rename(
		url.pathToFileURL(`${tempDirPath}node_modules/reeceorbuck-typscriptModule-8f10914`),
		url.pathToFileURL(`${tempDirPath}node_modules/typescript`),
	);
}

const require = createRequire(url.pathToFileURL(`${tempDirPath}`));
export default require('typescript');
