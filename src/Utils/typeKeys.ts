import { translate } from "../NodeParser/IntersectionNodeParser.ts";
import { AnyType } from "../Type/AnyType.ts";
import { ArrayType } from "../Type/ArrayType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { IntersectionType } from "../Type/IntersectionType.ts";
import { LiteralType } from "../Type/LiteralType.ts";
import { NumberType } from "../Type/NumberType.ts";
import { ObjectType } from "../Type/ObjectType.ts";
import { StringType } from "../Type/StringType.ts";
import { TupleType } from "../Type/TupleType.ts";
import { UndefinedType } from "../Type/UndefinedType.ts";
import { UnionType } from "../Type/UnionType.ts";
import { derefAnnotatedType, derefType } from "./derefType.ts";
import { preserveAnnotation } from "./preserveAnnotation.ts";
import { uniqueArray } from "./uniqueArray.ts";
import { uniqueTypeArray } from "./uniqueTypeArray.ts";

function uniqueLiterals(types: LiteralType[]): LiteralType[] {
  const values = types.map((type) => type.getValue());
  return uniqueArray(values).map((value) => new LiteralType(value));
}

export function getTypeKeys(type: BaseType | undefined): LiteralType[] {
  type = derefType(type);

  if (type instanceof IntersectionType || type instanceof UnionType) {
    return uniqueLiterals(
      type.getTypes().reduce(
        (
          result: LiteralType[],
          subType,
        ) => [...result, ...getTypeKeys(subType)],
        [],
      ),
    );
  }

  if (type instanceof TupleType) {
    return type.getTypes().map((it, idx) => new LiteralType(idx));
  }
  if (type instanceof ObjectType) {
    const objectProperties = type.getProperties().map((it) =>
      new LiteralType(it.getName())
    );
    return uniqueLiterals(
      type
        .getBaseTypes()
        .reduce(
          (
            result: LiteralType[],
            parentType,
          ) => [...result, ...getTypeKeys(parentType)],
          objectProperties,
        ),
    );
  }

  return [];
}

export function getTypeByKey(
  type: BaseType | undefined,
  index: LiteralType | StringType,
): BaseType | undefined {
  type = derefType(type);

  if (type instanceof IntersectionType || type instanceof UnionType) {
    let subTypes: BaseType[] = [];

    // we use the annotation from the first type so we need to get a reference to it
    let firstType: BaseType | undefined;

    for (const subType of type.getTypes()) {
      const subKeyType = getTypeByKey(subType, index);
      if (subKeyType) {
        subTypes.push(subKeyType);
        if (!firstType) {
          firstType = subKeyType;
        }
      }
    }

    subTypes = uniqueTypeArray(subTypes);
    let returnType: BaseType | undefined = undefined;

    if (subTypes.length == 1) {
      return firstType;
    } else if (subTypes.length > 1) {
      if (type instanceof UnionType) {
        returnType = new UnionType(subTypes);
      } else {
        returnType = translate(subTypes);
      }
    }

    if (!returnType) {
      return undefined;
    }
    if (!firstType) {
      return returnType;
    }

    return preserveAnnotation(firstType, returnType);
  }

  if (type instanceof TupleType && index instanceof LiteralType) {
    return type.getTypes().find((it, idx) => idx === index.getValue());
  }
  if (type instanceof ArrayType && index instanceof NumberType) {
    return type.getItem();
  }
  if (type instanceof ObjectType) {
    if (index instanceof LiteralType) {
      const property = type.getProperties().find((it) =>
        it.getName() === index.getValue()
      );
      if (property) {
        const propertyType = property.getType();
        if (propertyType === undefined) {
          return undefined;
        }
        let newPropType = derefAnnotatedType(propertyType);
        if (!property.isRequired()) {
          if (newPropType instanceof UnionType) {
            if (
              !newPropType.getTypes().some((subType) =>
                subType instanceof UndefinedType
              )
            ) {
              newPropType = new UnionType([
                ...newPropType.getTypes(),
                new UndefinedType(),
              ]);
            }
          } else {
            newPropType = new UnionType([newPropType, new UndefinedType()]);
          }
        }

        return preserveAnnotation(propertyType, newPropType);
      }
    }

    const additionalProperty = type.getAdditionalProperties();
    if (additionalProperty instanceof BaseType) {
      return additionalProperty;
    } else if (additionalProperty === true) {
      return new AnyType();
    }

    for (const subType of type.getBaseTypes()) {
      const subKeyType = getTypeByKey(subType, index);
      if (subKeyType) {
        return subKeyType;
      }
    }

    return undefined;
  }

  return undefined;
}
