import { createRequire } from 'https://deno.land/std@0.138.0/node/module.ts';

console.log('import.meta.url: ', import.meta.url);
// metaURL:  file:///Users/reeceorbuck/Projects/ts-json-schema-generator/nodeCompatibility/exports.ts

console.log(
	'import.meta.main: ',
	import.meta.main,
);

const require = createRequire(import.meta.url);
export default require('typescript');
