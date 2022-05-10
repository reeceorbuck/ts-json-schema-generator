import { createRequire } from 'https://deno.land/std@0.138.0/node/module.ts';
import * as path from 'https://deno.land/std@0.138.0/path/mod.ts';
import * as url from 'https://deno.land/std@0.138.0/node/url.ts';

console.log('import.meta.url: ', url.pathToFileURL(import.meta.url));
// internal import.meta.url:  file:///Users/reeceorbuck/Projects/ts-json-schema-generator/nodeCompatibility/exports.ts
// external import.meta.url:  https://raw.githubusercontent.com/reeceorbuck/ts-json-schema-generator/next/nodeCompatibility/exports.ts
// "/Users/reeceorbuck/Library/Caches/deno/gen/file/Users/reeceorbuck/Projects/ts-json-schema-generator/nodeCompatibility/exports.ts.js"

const p = path.toFileUrl('/home/foo');

console.log(
	'p: ',
	path.dirname(),
);

path.toFileUrl('/var/tmp/a.log');

console.log('test: ', new URL('static-files', import.meta.url).pathname);

console.log('file://$cwd: ', Deno.cwd());

const require = createRequire(import.meta.url);
export default require('typescript');
