import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { AnyType } from "../Type/AnyType.ts";
import { BaseType } from "../Type/BaseType.ts";

export class AnyTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.AnyKeyword ||
      node.kind === ts.SyntaxKind.SymbolKeyword;
  }
  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new AnyType();
  }
}
