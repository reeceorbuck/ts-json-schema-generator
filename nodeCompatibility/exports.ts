import { createRequire } from 'https://deno.land/std@0.138.0/node/module.ts';
import url from 'https://deno.land/std@0.138.0/node/url.ts';
import tempDir from 'https://deno.land/x/temp_dir@v1.0.0/mod.ts';
import { writeAll } from 'https://deno.land/std@0.138.0/streams/mod.ts';
import { copy } from 'https://deno.land/std@0.139.0/fs/copy.ts';

const tempDirPath = tempDir;
let module;

// try {
// 	await Deno.stat(url.pathToFileURL(`${tempDirPath}/node_modules/typescript`));
// 	console.log('Temp typescript module already exists, no need to fetch it again.');
// } catch {

try {
	await Deno.remove(`${tempDirPath}/node_modules/typescriptBackup`, { recursive: true });
} catch {
	// Only errors if the folder doesnt exist, which is fine.
	// console.log('Failed to remove existing: ', err);
}

const require = createRequire(url.pathToFileURL(`${tempDirPath}/`));

try {
	module = require('typescript');
} catch {
	console.log('Fetching Typescript dependency for caching...');

	try {
		await Deno.remove(`${tempDirPath}/node_modules/typescript`, { recursive: true });
	} catch {
		// console.log('Failed to remove existing: ', err);
	}

	const response = await fetch('https://github.com/reeceorbuck/typscriptModule/zipball/main');
	const blob = await response.blob();
	const buf = await blob.arrayBuffer();
	const data = new Uint8Array(buf);
	// We then create a new file and write into it
	const file = await Deno.create(`${tempDirPath}/typescript.zip`);
	await writeAll(file, data);
	Deno.close(file.rid);

	const zipSourcePath = url.pathToFileURL(`${tempDirPath}/typescript.zip`);
	const destinationPath = url.pathToFileURL(`${tempDirPath}/node_modules`);

	const p = Deno.run({
		cmd: Deno.build.os === 'windows'
			? [
				'PowerShell',
				'Expand-Archive',
				'-Path',
				zipSourcePath.pathname.slice(1),
				'-DestinationPath',
				destinationPath.pathname.slice(1),
			]
			: ['unzip', zipSourcePath.pathname, '-d', destinationPath.pathname],
		stdout: 'piped',
		stderr: 'piped',
	});

	await Promise.all([
		p.status(),
		p.output(),
		p.stderrOutput(),
	]);
	p.close();

	await Deno.remove(`${tempDirPath}/typescript.zip`);

	await Deno.rename(
		`${tempDirPath}/node_modules/reeceorbuck-typscriptModule-8f10914`,
		`${tempDirPath}/node_modules/typescript`,
	);
	// There is an issue where the createRequire must cache the first time we try to get typescript
	// So we copy to a different name so can get a fresh import
	// Next time this runs it cleans up the backup folder for us and uses the original which will now work
	await copy(`${tempDirPath}/node_modules/typescript`, `${tempDirPath}/node_modules/typescriptBackup`);

	try {
		module = require('typescriptBackup');
	} catch (err) {
		console.error('Still failed after rebuild of typescript module, err: ', err);
	}
}

export default module;
