import { BaseType } from "../Type/BaseType.ts";
import { UndefinedType } from "../Type/UndefinedType.ts";
import { UnionType } from "../Type/UnionType.ts";
import { derefAnnotatedType } from "./derefType.ts";
import { preserveAnnotation } from "./preserveAnnotation.ts";

/**
 * Remove undefined types from union type. Returns the number of non-undefined properties.
 */
export function removeUndefined(
  propertyType: UnionType,
): { numRemoved: number; newType: BaseType } {
  const types: BaseType[] = [];
  let numRemoved = 0;

  for (const type of propertyType.getTypes()) {
    const newType = derefAnnotatedType(type);
    if (newType instanceof UndefinedType) {
      numRemoved += 1;
    } else if (newType instanceof UnionType) {
      const result = removeUndefined(newType);
      numRemoved += result.numRemoved;
      types.push(preserveAnnotation(type, result.newType));
    } else {
      types.push(type);
    }
  }

  const newType = types.length == 0
    ? new UndefinedType()
    : types.length == 1
    ? types[0]
    : new UnionType(types);

  return {
    numRemoved,
    newType,
  };
}
