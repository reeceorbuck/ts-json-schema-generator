import ts from "../tsAdapter.ts";
import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { LiteralType } from "../Type/LiteralType.ts";
import { UnionType } from "../Type/UnionType.ts";
import { extractLiterals } from "../Utils/extractLiterals.ts";

export class StringTemplateLiteralNodeParser implements SubNodeParser {
  public constructor(protected childNodeParser: NodeParser) {}

  public supportsNode(
    node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode,
  ): boolean {
    return (
      node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
      node.kind === ts.SyntaxKind.TemplateLiteralType
    );
  }
  public createType(
    node: ts.NoSubstitutionTemplateLiteral | ts.TemplateLiteralTypeNode,
    context: Context,
  ): BaseType {
    if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
      return new LiteralType(node.text);
    }
    const prefix = node.head.text;
    const matrix: string[][] = [[prefix]].concat(
      node.templateSpans.map((span) => {
        const suffix = span.literal.text;
        const type = this.childNodeParser.createType(span.type, context);
        return extractLiterals(type).map((value) => value + suffix);
      }),
    );

    const expandedLiterals = expand(matrix);

    const expandedTypes = expandedLiterals.map((literal) =>
      new LiteralType(literal)
    );

    if (expandedTypes.length === 1) {
      return expandedTypes[0];
    }

    return new UnionType(expandedTypes);
  }
}

function expand(matrix: string[][]): string[] {
  if (matrix.length === 1) {
    return matrix[0];
  }
  const head = matrix[0];
  const nested = expand(matrix.slice(1));
  const combined = head.map((prefix) =>
    nested.map((suffix) => prefix + suffix)
  );
  return ([] as string[]).concat(...combined);
}
