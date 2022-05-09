import ts from "./tsAdapter.ts";
import { NodeParser } from "./NodeParser.ts";

export interface SubNodeParser extends NodeParser {
  supportsNode(node: ts.Node): boolean;
}
