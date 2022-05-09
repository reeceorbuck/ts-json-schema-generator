import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { ArrayType } from "../Type/ArrayType.ts";
import { BaseType } from "../Type/BaseType.ts";

export class ArrayNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(node: ts.ArrayTypeNode): boolean {
    return node.kind === ts.SyntaxKind.ArrayType;
  }

  public createType(
    node: ts.ArrayTypeNode,
    context: Context,
  ): BaseType | undefined {
    const type = this.childNodeParser.createType(node.elementType, context);
    if (type === undefined) {
      return undefined;
    }
    return new ArrayType(type);
  }
}
