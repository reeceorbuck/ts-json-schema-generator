import { createRequire } from 'https://deno.land/std@0.138.0/node/module.ts';
import url from 'https://deno.land/std@0.138.0/node/url.ts';
// import * as path from 'https://deno.land/std@0.138.0/path/mod.ts';
// import * as url from 'https://deno.land/std@0.138.0/node/url.ts';

// console.log('import.meta.url: ', url.pathToFileURL(import.meta.url));
// internal import.meta.url:  file:///Users/reeceorbuck/Projects/ts-json-schema-generator/nodeCompatibility/exports.ts
// external import.meta.url:  https://raw.githubusercontent.com/reeceorbuck/ts-json-schema-generator/next/nodeCompatibility/exports.ts
const hardCode = '/Users/reeceorbuck/Library/Caches/deno/gen/file/Users/reeceorbuck/Projects/ts-json-schema-generator/';

// const p = path.toFileUrl('/home/foo');

// path.toFileUrl('/var/tmp/a.log');

// console.log('test: ', new URL('static-files', import.meta.url).pathname);

console.log('hardCode url: ', url.pathToFileURL(hardCode).href);

const require = createRequire(url.pathToFileURL(hardCode).href);
export default require('typescript');
