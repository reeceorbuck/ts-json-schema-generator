import { createRequire } from 'https://deno.land/std@0.138.0/node/module.ts';
import url from 'https://deno.land/std@0.138.0/node/url.ts';

// TODO: this needs to be configurable for different OS and paths
const globalTypescript = '/opt/homebrew/lib/';

const require = createRequire(url.pathToFileURL(globalTypescript));
export default require('typescript');
