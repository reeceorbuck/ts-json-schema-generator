import { Config } from "../src/Config.ts";
import { SchemaGenerator } from "../src/SchemaGenerator.ts";
import { createFormatter } from "./formatter.ts";
import { createParser } from "./parser.ts";
import { createProgram } from "./program.ts";

export function createGenerator(config: Config): SchemaGenerator {
  const program = createProgram(config);
  const parser = createParser(program, config);
  const formatter = createFormatter(config);

  return new SchemaGenerator(program, parser, formatter, config);
}
