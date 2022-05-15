import * as path from 'https://deno.land/std@0.138.0/path/mod.ts';
import { expandGlobSync } from 'https://deno.land/std@0.136.0/fs/mod.ts';

import ts from '../src/tsAdapter.ts';

import { Config } from '../src/Config.ts';
import { DiagnosticError } from '../src/Error/DiagnosticError.ts';
import { LogicError } from '../src/Error/LogicError.ts';
import { NoRootNamesError } from '../src/Error/NoRootNamesError.ts';
import { NoTSConfigError } from '../src/Error/NoTSConfigError.ts';

function loadTsConfigFile(configFile: string) {
	const raw = ts.sys.readFile(configFile);
	if (raw) {
		const config = ts.parseConfigFileTextToJson(configFile, raw);

		if (config.error) {
			throw new DiagnosticError([config.error]);
		} else if (!config.config) {
			throw new LogicError(`Invalid parsed config file "${configFile}"`);
		}

		const parseResult = ts.parseJsonConfigFileContent(
			config.config,
			ts.sys,
			path.resolve(path.dirname(configFile)),
			{},
			configFile,
		);
		parseResult.options.noEmit = true;
		delete parseResult.options.out;
		delete parseResult.options.outDir;
		delete parseResult.options.outFile;
		delete parseResult.options.declaration;
		delete parseResult.options.declarationDir;
		delete parseResult.options.declarationMap;

		return parseResult;
	} else {
		throw new NoTSConfigError();
	}
}

function getTsConfig(config: Config) {
	if (config.tsconfig) {
		return loadTsConfigFile(config.tsconfig);
	}

	return {
		fileNames: [],
		options: {
			noEmit: true,
			emitDecoratorMetadata: true,
			experimentalDecorators: true,
			target: ts.ScriptTarget.ES5,
			module: ts.ModuleKind.CommonJS,
			strictNullChecks: false,
		},
	};
}

export function createProgram(config: Config): ts.Program {
	const files = [...expandGlobSync(config.path!)].map((dirEntry) => dirEntry.path.replace(/\\/g, '/'));

	const rootNamesFromPath = config.path ? files : [];
	const tsconfig = getTsConfig(config);

	const rootNames = rootNamesFromPath.length ? rootNamesFromPath : tsconfig.fileNames;

	if (!rootNames.length) {
		throw new NoRootNamesError();
	}

	const program: ts.Program = ts.createProgram(
		rootNames as string[],
		tsconfig.options,
	);

	if (!config.skipTypeCheck) {
		const diagnostics = ts.getPreEmitDiagnostics(program);
		if (diagnostics.length) {
			throw new DiagnosticError(diagnostics);
		}
	}

	return program;
}
