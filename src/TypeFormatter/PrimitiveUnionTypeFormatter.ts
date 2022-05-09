import { LogicError } from "../Error/LogicError.ts";
import { Definition } from "../Schema/Definition.ts";
import { RawTypeName } from "../Schema/RawType.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { BooleanType } from "../Type/BooleanType.ts";
import { NullType } from "../Type/NullType.ts";
import { NumberType } from "../Type/NumberType.ts";
import { PrimitiveType } from "../Type/PrimitiveType.ts";
import { StringType } from "../Type/StringType.ts";
import { UnionType } from "../Type/UnionType.ts";
import { uniqueArray } from "../Utils/uniqueArray.ts";

export class PrimitiveUnionTypeFormatter implements SubTypeFormatter {
  public supportsType(type: UnionType): boolean {
    return type instanceof UnionType && type.getTypes().length > 0 &&
      this.isPrimitiveUnion(type);
  }
  public getDefinition(type: UnionType): Definition {
    return {
      type: uniqueArray(
        type.getTypes().map((item) => this.getPrimitiveType(item)),
      ),
    };
  }
  public getChildren(type: UnionType): BaseType[] {
    return [];
  }

  protected isPrimitiveUnion(type: UnionType): boolean {
    return type.getTypes().every((item) => item instanceof PrimitiveType);
  }
  protected getPrimitiveType(item: BaseType): RawTypeName {
    if (item instanceof StringType) {
      return "string";
    } else if (item instanceof NumberType) {
      return "number";
    } else if (item instanceof BooleanType) {
      return "boolean";
    } else if (item instanceof NullType) {
      return "null";
    }

    throw new LogicError("Unexpected code branch");
  }
}
