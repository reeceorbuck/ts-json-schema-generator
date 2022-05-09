import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { notUndefined } from "../Utils/notUndefined.ts";
import { TupleType } from "../Type/TupleType.ts";

export class ArrayLiteralExpressionNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(node: ts.ArrayLiteralExpression): boolean {
    return node.kind === ts.SyntaxKind.ArrayLiteralExpression;
  }

  public createType(
    node: ts.ArrayLiteralExpression,
    context: Context,
  ): BaseType | undefined {
    if (node.elements) {
      const elements = node.elements.map((t) =>
        this.childNodeParser.createType(t, context)
      ).filter(notUndefined);

      return new TupleType(elements);
    }

    // TODO: implement this?
    return undefined;
  }
}
