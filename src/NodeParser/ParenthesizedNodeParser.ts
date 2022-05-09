import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";

export class ParenthesizedNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(node: ts.ParenthesizedTypeNode): boolean {
    return node.kind === ts.SyntaxKind.ParenthesizedType;
  }
  public createType(
    node: ts.ParenthesizedTypeNode,
    context: Context,
  ): BaseType | undefined {
    const type = this.childNodeParser.createType(node.type, context);
    if (!type) {
      return undefined;
    }
    return type;
  }
}
