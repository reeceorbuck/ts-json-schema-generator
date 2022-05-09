import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { ArrayType } from "../Type/ArrayType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { TypeFormatter } from "../TypeFormatter.ts";

export class ArrayTypeFormatter implements SubTypeFormatter {
  public constructor(private childTypeFormatter: TypeFormatter) {}

  public supportsType(type: ArrayType): boolean {
    return type instanceof ArrayType;
  }
  public getDefinition(type: ArrayType): Definition {
    return {
      type: "array",
      items: this.childTypeFormatter.getDefinition(type.getItem()),
    };
  }
  public getChildren(type: ArrayType): BaseType[] {
    return this.childTypeFormatter.getChildren(type.getItem());
  }
}
