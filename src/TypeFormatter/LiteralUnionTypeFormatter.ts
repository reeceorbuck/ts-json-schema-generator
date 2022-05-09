import { Definition } from "../Schema/Definition.ts";
import { RawTypeName } from "../Schema/RawType.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { LiteralType } from "../Type/LiteralType.ts";
import { NullType } from "../Type/NullType.ts";
import { UnionType } from "../Type/UnionType.ts";
import { typeName } from "../Utils/typeName.ts";
import { uniqueArray } from "../Utils/uniqueArray.ts";

export class LiteralUnionTypeFormatter implements SubTypeFormatter {
  public supportsType(type: UnionType): boolean {
    return type instanceof UnionType && type.getTypes().length > 0 &&
      this.isLiteralUnion(type);
  }
  public getDefinition(type: UnionType): Definition {
    const values = uniqueArray(
      type.getTypes().map((item: LiteralType | NullType) =>
        this.getLiteralValue(item)
      ),
    );
    const types = uniqueArray(
      type.getTypes().map((item: LiteralType | NullType) =>
        this.getLiteralType(item)
      ),
    );

    if (types.length === 1) {
      return {
        type: types[0],
        enum: values,
      };
    } else {
      return {
        type: types,
        enum: values,
      };
    }
  }
  public getChildren(type: UnionType): BaseType[] {
    return [];
  }

  protected isLiteralUnion(type: UnionType): boolean {
    return type.getTypes().every((item) =>
      item instanceof LiteralType || item instanceof NullType
    );
  }
  protected getLiteralValue(
    value: LiteralType | NullType,
  ): string | number | boolean | null {
    return value instanceof LiteralType ? value.getValue() : null;
  }
  protected getLiteralType(value: LiteralType | NullType): RawTypeName {
    return value instanceof LiteralType ? typeName(value.getValue()) : "null";
  }
}
