import { createRequire } from 'https://deno.land/std@0.138.0/node/module.ts';
import { fromMeta } from 'https://x.nest.land/dirname_deno@0.3.0/mod.ts';
// or from "https://deno.land/x/dirname_deno@v0.3.0/mod.ts"

const { __dirname, __filename } = fromMeta(import.meta);

console.log(__dirname); // /home/you/projects/project/src
console.log(__filename); // /home/you/projects/project/src/main.ts

console.log('import.meta.url: ', import.meta.url);
// internal import.meta.url:  file:///Users/reeceorbuck/Projects/ts-json-schema-generator/nodeCompatibility/exports.ts
// external import.meta.url:  https://raw.githubusercontent.com/reeceorbuck/ts-json-schema-generator/next/nodeCompatibility/exports.ts
// "/Users/reeceorbuck/Library/Caches/deno/gen/file/Users/reeceorbuck/Projects/ts-json-schema-generator/nodeCompatibility/exports.ts.js"

console.log('test: ', new URL('static-files', import.meta.url).pathname);

const require = createRequire(import.meta.url);
export default require('typescript');
