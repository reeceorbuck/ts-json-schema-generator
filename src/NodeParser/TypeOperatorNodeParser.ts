import ts from "../tsAdapter.ts";

import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { ArrayType } from "../Type/ArrayType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { NumberType } from "../Type/NumberType.ts";
import { ObjectType } from "../Type/ObjectType.ts";
import { StringType } from "../Type/StringType.ts";
import { UnionType } from "../Type/UnionType.ts";
import { derefType } from "../Utils/derefType.ts";
import { getTypeKeys } from "../Utils/typeKeys.ts";

export class TypeOperatorNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(node: ts.TypeOperatorNode): boolean {
    return node.kind === ts.SyntaxKind.TypeOperator;
  }

  public createType(node: ts.TypeOperatorNode, context: Context): BaseType {
    const type = this.childNodeParser.createType(node.type, context);
    const derefed = derefType(type);
    // Remove readonly modifier from type
    if (node.operator === ts.SyntaxKind.ReadonlyKeyword && derefed) {
      return derefed;
    }
    if (derefed instanceof ArrayType) {
      return new NumberType();
    }
    const keys = getTypeKeys(type);
    if (derefed instanceof ObjectType && derefed.getAdditionalProperties()) {
      return new UnionType([...keys, new StringType()]);
    }

    if (keys.length === 1) {
      return keys[0];
    }

    return new UnionType(keys);
  }
}
