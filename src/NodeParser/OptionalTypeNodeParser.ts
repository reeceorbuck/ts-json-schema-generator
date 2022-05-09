import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { OptionalType } from "../Type/OptionalType.ts";

export class OptionalTypeNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}
  public supportsNode(node: ts.OptionalTypeNode): boolean {
    return node.kind === ts.SyntaxKind.OptionalType;
  }
  public createType(
    node: ts.OptionalTypeNode,
    context: Context,
  ): BaseType | undefined {
    const type = this.childNodeParser.createType(node.type, context);
    if (!type) {
      return undefined;
    }
    return new OptionalType(type);
  }
}
