import { createRequire } from 'https://deno.land/std@0.138.0/node/module.ts';
import url from 'https://deno.land/std@0.138.0/node/url.ts';

const globalTypescript = '/opt/homebrew/lib/';

const require = createRequire(url.pathToFileURL(globalTypescript));
export default require('typescript');
