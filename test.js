import * as tsj from './index.ts';
import tempDir from 'https://deno.land/x/temp_dir@v1.0.0/mod.ts';

const config = {
	path: 'input.d.ts',
	type: '*', // Or <type-name> if you want to generate schema for that one type only
};

console.log('Deno temp dir: ', tempDir);

const output_path = 'outputB.json';

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
Deno.writeTextFile(output_path, schemaString);
