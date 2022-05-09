import * as tsj from "./index.ts";
/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
  path: "input.d.ts",
  type: "*", // Or <type-name> if you want to generate schema for that one type only
};

const output_path = "outputB.json";

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
Deno.writeTextFile(output_path, schemaString);
