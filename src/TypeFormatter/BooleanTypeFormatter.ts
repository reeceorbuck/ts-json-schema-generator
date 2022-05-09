import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { BooleanType } from "../Type/BooleanType.ts";

export class BooleanTypeFormatter implements SubTypeFormatter {
  public supportsType(type: BooleanType): boolean {
    return type instanceof BooleanType;
  }
  public getDefinition(type: BooleanType): Definition {
    return { type: "boolean" };
  }
  public getChildren(type: BooleanType): BaseType[] {
    return [];
  }
}
