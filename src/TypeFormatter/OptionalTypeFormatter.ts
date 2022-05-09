import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { OptionalType } from "../Type/OptionalType.ts";
import { TypeFormatter } from "../TypeFormatter.ts";

export class OptionalTypeFormatter implements SubTypeFormatter {
  public constructor(protected childTypeFormatter: TypeFormatter) {}

  public supportsType(type: OptionalType): boolean {
    return type instanceof OptionalType;
  }
  public getDefinition(type: OptionalType): Definition {
    return this.childTypeFormatter.getDefinition(type.getType());
  }
  public getChildren(type: OptionalType): BaseType[] {
    return this.childTypeFormatter.getChildren(type.getType());
  }
}
