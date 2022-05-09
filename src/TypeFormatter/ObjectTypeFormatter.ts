import { Definition } from "../Schema/Definition.ts";
import { SubTypeFormatter } from "../SubTypeFormatter.ts";
import { AnyType } from "../Type/AnyType.ts";
import { SymbolType } from "../Type/SymbolType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { ObjectProperty, ObjectType } from "../Type/ObjectType.ts";
import { UndefinedType } from "../Type/UndefinedType.ts";
import { UnionType } from "../Type/UnionType.ts";
import { TypeFormatter } from "../TypeFormatter.ts";
import { getAllOfDefinitionReducer } from "../Utils/allOfDefinition.ts";
import { derefType } from "../Utils/derefType.ts";
import { preserveAnnotation } from "../Utils/preserveAnnotation.ts";
import { removeUndefined } from "../Utils/removeUndefined.ts";
import { StringMap } from "../Utils/StringMap.ts";
import { uniqueArray } from "../Utils/uniqueArray.ts";

export class ObjectTypeFormatter implements SubTypeFormatter {
  public constructor(protected childTypeFormatter: TypeFormatter) {}

  public supportsType(type: ObjectType): boolean {
    return type instanceof ObjectType;
  }

  public getDefinition(type: ObjectType): Definition {
    const types = type.getBaseTypes();
    if (types.length === 0) {
      return this.getObjectDefinition(type);
    }

    return types.reduce(
      getAllOfDefinitionReducer(this.childTypeFormatter),
      this.getObjectDefinition(type),
    );
  }

  public getChildren(type: ObjectType): BaseType[] {
    const properties = type.getProperties();
    const additionalProperties: BaseType | boolean = type
      .getAdditionalProperties();

    const childrenOfBase = type
      .getBaseTypes()
      .reduce(
        (
          result: BaseType[],
          baseType,
        ) => [...result, ...this.childTypeFormatter.getChildren(baseType)],
        [],
      );

    const childrenOfAdditionalProps = additionalProperties instanceof BaseType
      ? this.childTypeFormatter.getChildren(additionalProperties)
      : [];

    const childrenOfProps = properties.reduce(
      (result: BaseType[], property) => {
        const propertyType = property.getType();
        if (propertyType === undefined) {
          return result;
        }

        return [
          ...result,
          ...this.childTypeFormatter.getChildren(propertyType),
        ];
      },
      [],
    );

    const children = [
      ...childrenOfBase,
      ...childrenOfAdditionalProps,
      ...childrenOfProps,
    ];

    return uniqueArray(children);
  }

  protected getObjectDefinition(type: ObjectType): Definition {
    const objectProperties = type.getProperties();
    const additionalProperties: BaseType | boolean = type
      .getAdditionalProperties();

    const preparedProperties = objectProperties.map((property) =>
      this.prepareObjectProperty(property)
    );

    const required = preparedProperties
      .filter((property) => property.isRequired())
      .map((property) => property.getName());

    const properties = preparedProperties.reduce(
      (result: StringMap<Definition>, property) => {
        const propertyType = property.getType();

        if (propertyType !== undefined) {
          result[property.getName()] = this.childTypeFormatter.getDefinition(
            propertyType,
          );
        }

        return result;
      },
      {},
    );

    return {
      type: "object",
      ...(Object.keys(properties).length > 0 ? { properties } : {}),
      ...(required.length > 0 ? { required } : {}),
      ...(additionalProperties === true ||
          additionalProperties instanceof AnyType ||
          additionalProperties instanceof SymbolType
        ? {}
        : {
          additionalProperties: additionalProperties instanceof BaseType
            ? this.childTypeFormatter.getDefinition(additionalProperties)
            : additionalProperties,
        }),
    };
  }

  protected prepareObjectProperty(property: ObjectProperty): ObjectProperty {
    const propertyType = property.getType();
    const propType = derefType(propertyType);

    if (propType instanceof UndefinedType) {
      return new ObjectProperty(property.getName(), propertyType, false);
    } else if (!(propType instanceof UnionType)) {
      return property;
    }

    const { newType: newPropType, numRemoved } = removeUndefined(propType);

    if (numRemoved == 0) {
      return property;
    }

    return new ObjectProperty(
      property.getName(),
      preserveAnnotation(propertyType!, newPropType),
      false,
    );
  }
}
