import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { RestType } from "../Type/RestType.ts";
import { TypeFormatter } from "../TypeFormatter.ts";

export class RestTypeFormatter implements SubTypeFormatter {
  public constructor(protected childTypeFormatter: TypeFormatter) {}

  public supportsType(type: RestType): boolean {
    return type instanceof RestType;
  }
  public getDefinition(type: RestType): Definition {
    return this.childTypeFormatter.getDefinition(type.getType());
  }
  public getChildren(type: RestType): BaseType[] {
    return this.childTypeFormatter.getChildren(type.getType());
  }
}
