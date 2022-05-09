import ts from "../tsAdapter.ts";
import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";

export class LiteralNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(node: ts.LiteralTypeNode): boolean {
    return node.kind === ts.SyntaxKind.LiteralType;
  }
  public createType(
    node: ts.LiteralTypeNode,
    context: Context,
  ): BaseType | undefined {
    return this.childNodeParser.createType(node.literal, context);
  }
}
