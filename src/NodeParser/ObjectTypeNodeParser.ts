import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { ObjectType } from "../Type/ObjectType.ts";
import { getKey } from "../Utils/nodeKey.ts";

export class ObjectTypeNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.ObjectKeyword;
  }

  public createType(node: ts.KeywordTypeNode, context: Context): BaseType {
    return new ObjectType(
      `object-${getKey(node, context)}`,
      [],
      [],
      true,
      true,
    );
  }
}
