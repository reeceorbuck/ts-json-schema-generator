import ts from "../tsAdapter.ts";
import { Context } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { LiteralType } from "../Type/LiteralType.ts";
import { UnionType } from "../Type/UnionType.ts";
import assert from "../Utils/assert.ts";
import { extractLiterals } from "../Utils/extractLiterals.ts";

export const intrinsicMethods: Record<
  string,
  ((v: string) => string) | undefined
> = {
  Uppercase: (v) => v.toUpperCase(),
  Lowercase: (v) => v.toLowerCase(),
  Capitalize: (v) => v[0].toUpperCase() + v.slice(1),
  Uncapitalize: (v) => v[0].toLowerCase() + v.slice(1),
};

export class IntrinsicNodeParser implements SubNodeParser {
  public supportsNode(node: ts.KeywordTypeNode): boolean {
    return node.kind === ts.SyntaxKind.IntrinsicKeyword;
  }
  public createType(
    node: ts.KeywordTypeNode,
    context: Context,
  ): BaseType | undefined {
    const methodName = getParentName(node);
    const method = intrinsicMethods[methodName];
    assert(method, `Unknown intrinsic method: ${methodName}`);
    const literals = extractLiterals(context.getArguments()[0])
      .map(method)
      .map((literal) => new LiteralType(literal));
    if (literals.length === 1) {
      return literals[0];
    }
    return new UnionType(literals);
  }
}

function getParentName(node: ts.KeywordTypeNode): string {
  const parent = node.parent;
  assert(
    ts.isTypeAliasDeclaration(parent),
    "Only intrinsics part of a TypeAliasDeclaration are supported.",
  );
  return parent.name.text;
}
