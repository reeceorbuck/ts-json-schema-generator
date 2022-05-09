import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { StringType } from "../Type/StringType.ts";

export class StringTypeFormatter implements SubTypeFormatter {
  public supportsType(type: StringType): boolean {
    return type instanceof StringType;
  }
  public getDefinition(type: StringType): Definition {
    return { type: "string" };
  }
  public getChildren(type: StringType): BaseType[] {
    return [];
  }
}
