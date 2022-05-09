import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { UnionType } from "../Type/UnionType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { notUndefined } from "../Utils/notUndefined.ts";

export class UnionNodeParser implements SubNodeParser {
  public constructor(
    protected typeChecker: ts.TypeChecker,
    protected childNodeParser: NodeParser,
  ) {}

  public supportsNode(node: ts.UnionTypeNode): boolean {
    return node.kind === ts.SyntaxKind.UnionType;
  }

  public createType(
    node: ts.UnionTypeNode,
    context: Context,
  ): BaseType | undefined {
    const types = node.types
      .map((subnode) => {
        return this.childNodeParser.createType(subnode, context);
      })
      .filter(notUndefined);

    if (types.length === 1) {
      return types[0];
    } else if (types.length === 0) {
      return undefined;
    }

    return new UnionType(types);
  }
}
