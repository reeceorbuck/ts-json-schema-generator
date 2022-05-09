import ts from "../tsAdapter.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { FunctionType } from "../Type/FunctionType.ts";

/**
 * A function node parser that creates a function type so that mapped types can
 * use functions as values. There is no formatter for function types.
 */
export class FunctionNodeParser implements SubNodeParser {
  public supportsNode(node: ts.FunctionTypeNode): boolean {
    return node.kind === ts.SyntaxKind.FunctionType;
  }
  public createType(): BaseType {
    return new FunctionType();
  }
}
