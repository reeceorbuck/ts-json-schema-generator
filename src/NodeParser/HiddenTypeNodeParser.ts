import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { isNodeHidden } from "../Utils/isHidden.ts";

export class HiddenNodeParser implements SubNodeParser {
  public constructor(protected typeChecker: ts.TypeChecker) {}

  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return isNodeHidden(node);
  }

  public createType(
    node: ts.KeywordTypeNode,
    context: Context,
  ): BaseType | undefined {
    return undefined;
  }
}
