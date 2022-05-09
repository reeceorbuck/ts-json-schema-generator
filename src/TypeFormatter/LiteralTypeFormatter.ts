import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { LiteralType } from "../Type/LiteralType.ts";
import { typeName } from "../Utils/typeName.ts";

export class LiteralTypeFormatter implements SubTypeFormatter {
  public supportsType(type: LiteralType): boolean {
    return type instanceof LiteralType;
  }
  public getDefinition(type: LiteralType): Definition {
    return {
      type: typeName(type.getValue()),
      const: type.getValue(),
    };
  }
  public getChildren(type: LiteralType): BaseType[] {
    return [];
  }
}
