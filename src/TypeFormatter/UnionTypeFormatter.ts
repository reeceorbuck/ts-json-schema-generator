import type { JSONSchema7 } from "https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/json-schema/index.d.ts";
import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { BaseType } from "../Type/BaseType.ts";
import { UnionType } from "../Type/UnionType.ts";
import { TypeFormatter } from "../TypeFormatter.ts";
import { uniqueArray } from "../Utils/uniqueArray.ts";

export class UnionTypeFormatter implements SubTypeFormatter {
  public constructor(protected childTypeFormatter: TypeFormatter) {}

  public supportsType(type: UnionType): boolean {
    return type instanceof UnionType;
  }
  public getDefinition(type: UnionType): Definition {
    const definitions = type.getTypes().map((item) =>
      this.childTypeFormatter.getDefinition(item)
    );

    // TODO: why is this not covered by LiteralUnionTypeFormatter?
    // special case for string literals | string -> string
    let stringType = true;
    let oneNotEnum = false;
    for (const def of definitions) {
      if (def.type !== "string") {
        stringType = false;
        break;
      }
      if (def.enum === undefined) {
        oneNotEnum = true;
      }
    }
    if (stringType && oneNotEnum) {
      const values = [];
      for (const def of definitions) {
        if (def.enum) {
          values.push(...def.enum);
        } else if (def.const) {
          values.push(def.const);
        } else {
          return {
            type: "string",
          };
        }
      }
      return {
        type: "string",
        enum: values,
      };
    }

    const flattenedDefinitions: JSONSchema7[] = [];

    // Flatten anyOf inside anyOf unless the anyOf has an annotation
    for (const def of definitions) {
      if (Object.keys(def) === ["anyOf"]) {
        flattenedDefinitions.push(...(def.anyOf as any));
      } else {
        flattenedDefinitions.push(def);
      }
    }

    return flattenedDefinitions.length > 1
      ? {
        anyOf: flattenedDefinitions,
      }
      : flattenedDefinitions[0];
  }
  public getChildren(type: UnionType): BaseType[] {
    return uniqueArray(
      type
        .getTypes()
        .reduce(
          (
            result: BaseType[],
            item,
          ) => [...result, ...this.childTypeFormatter.getChildren(item)],
          [],
        ),
    );
  }
}
