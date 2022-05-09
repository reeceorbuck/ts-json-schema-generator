import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { NumberType } from "../Type/NumberType.ts";

export class NumberTypeFormatter implements SubTypeFormatter {
  public supportsType(type: NumberType): boolean {
    return type instanceof NumberType;
  }
  public getDefinition(type: NumberType): Definition {
    return { type: "number" };
  }
  public getChildren(type: NumberType): BaseType[] {
    return [];
  }
}
