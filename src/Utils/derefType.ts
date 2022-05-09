import { AliasType } from "../Type/AliasType.ts";
import { AnnotatedType } from "../Type/AnnotatedType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { DefinitionType } from "../Type/DefinitionType.ts";
import { ReferenceType } from "../Type/ReferenceType.ts";

export function derefType(type: BaseType | undefined): BaseType | undefined {
  if (
    type instanceof ReferenceType ||
    type instanceof DefinitionType ||
    type instanceof AliasType ||
    type instanceof AnnotatedType
  ) {
    return derefType(type.getType());
  }

  return type;
}

export function derefAnnotatedType(type: BaseType): BaseType {
  if (type instanceof AnnotatedType || type instanceof AliasType) {
    return derefAnnotatedType(type.getType());
  }

  return type;
}
