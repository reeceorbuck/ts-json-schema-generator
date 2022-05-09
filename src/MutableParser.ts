import { SubNodeParser } from "./SubNodeParser.ts";

export interface MutableParser {
  addNodeParser(parser: SubNodeParser): MutableParser;
}
