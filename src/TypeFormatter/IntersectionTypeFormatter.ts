import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { ArrayType } from "../Type/ArrayType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { IntersectionType } from "../Type/IntersectionType.ts";
import { TupleType } from "../Type/TupleType.ts";
import { TypeFormatter } from "../TypeFormatter.ts";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition.ts";
import { uniqueArray } from "../Utils/uniqueArray.ts";

export class IntersectionTypeFormatter implements SubTypeFormatter {
  public constructor(protected childTypeFormatter: TypeFormatter) {}

  public supportsType(type: IntersectionType): boolean {
    return type instanceof IntersectionType;
  }

  public getDefinition(type: IntersectionType): Definition {
    const dependencies: Definition[] = [];
    const nonArrayLikeTypes: BaseType[] = [];

    for (const t of type.getTypes()) {
      // Filter out Array like definitions that cannot be
      // easily mergeable into a single json-schema object
      if (t instanceof ArrayType || t instanceof TupleType) {
        dependencies.push(this.childTypeFormatter.getDefinition(t));
      } else {
        nonArrayLikeTypes.push(t);
      }
    }

    if (nonArrayLikeTypes.length) {
      // There are non array (mergeable requirements)
      dependencies.push(
        nonArrayLikeTypes.reduce(
          getAllOfDefinitionReducer(this.childTypeFormatter),
          {
            type: "object",
            additionalProperties: false,
          },
        ),
      );
    }

    return dependencies.length === 1
      ? dependencies[0]
      : { allOf: dependencies };
  }

  public getChildren(type: IntersectionType): BaseType[] {
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
