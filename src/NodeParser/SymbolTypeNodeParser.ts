import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { SymbolType } from "../Type/SymbolType.ts";

export class SymbolTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.SymbolKeyword;
  }

  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new SymbolType();
  }
}
