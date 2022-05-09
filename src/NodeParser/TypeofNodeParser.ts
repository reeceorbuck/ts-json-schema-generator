import ts from "../tsAdapter.ts";

import { LogicError } from "../Error/LogicError.ts";
import { Context, NodeParser } from "../NodeParser.ts";
import { SubNodeParser } from "../SubNodeParser.ts";
import { BaseType } from "../Type/BaseType.ts";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.ts";
import { ReferenceType } from "../Type/ReferenceType.ts";
import { getKey } from "../Utils/nodeKey.ts";
import { LiteralType } from "../Type/LiteralType.ts";

export class TypeofNodeParser implements SubNodeParser {
  public constructor(
    protected typeChecker: ts.TypeChecker,
    protected childNodeParser: NodeParser,
  ) {}

  public supportsNode(node: ts.TypeQueryNode): boolean {
    return node.kind === ts.SyntaxKind.TypeQuery;
  }

  public createType(
    node: ts.TypeQueryNode,
    context: Context,
    reference?: ReferenceType,
  ): BaseType | undefined {
    let symbol = this.typeChecker.getSymbolAtLocation(node.exprName)!;
    if (symbol.flags & ts.SymbolFlags.Alias) {
      symbol = this.typeChecker.getAliasedSymbol(symbol);
    }

    const valueDec = symbol.valueDeclaration!;
    if (ts.isEnumDeclaration(valueDec)) {
      return this.createObjectFromEnum(valueDec, context, reference);
    } else if (
      ts.isVariableDeclaration(valueDec) ||
      ts.isPropertySignature(valueDec) ||
      ts.isPropertyDeclaration(valueDec)
    ) {
      if (valueDec.type) {
        return this.childNodeParser.createType(valueDec.type, context);
      } else if (valueDec.initializer) {
        return this.childNodeParser.createType(valueDec.initializer, context);
      }
    } else if (ts.isClassDeclaration(valueDec)) {
      return this.childNodeParser.createType(valueDec, context);
    } else if (ts.isPropertyAssignment(valueDec)) {
      return this.childNodeParser.createType(valueDec.initializer, context);
    }

    throw new LogicError(
      `Invalid type query "${valueDec.getFullText()}" (ts.SyntaxKind = ${valueDec.kind})`,
    );
  }

  protected createObjectFromEnum(
    node: ts.EnumDeclaration,
    context: Context,
    reference?: ReferenceType,
  ): ObjectType {
    const id = `typeof-enum-${getKey(node, context)}`;
    if (reference) {
      reference.setId(id);
      reference.setName(id);
    }

    let type: BaseType | null | undefined = null;
    const properties = node.members.map((member) => {
      const name = member.name.getText();
      if (member.initializer) {
        type = this.childNodeParser.createType(member.initializer, context);
      } else if (type === null) {
        type = new LiteralType(0);
      } else if (
        type instanceof LiteralType && typeof type.getValue() === "number"
      ) {
        type = new LiteralType(+type.getValue() + 1);
      } else {
        throw new LogicError(`Enum initializer missing for "${name}"`);
      }
      return new ObjectProperty(name, type, true);
    });

    return new ObjectType(id, [], properties, false);
  }
}
