import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { UndefinedType } from "../Type/UndefinedType.ts";

export class UndefinedTypeFormatter implements SubTypeFormatter {
  public supportsType(type: UndefinedType): boolean {
    return type instanceof UndefinedType;
  }
  public getDefinition(type: UndefinedType): Definition {
    return { not: {} };
  }
  public getChildren(type: UndefinedType): BaseType[] {
    return [];
  }
}
