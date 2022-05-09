import { UnknownTypeError } from "../Error/UnknownTypeError.ts";
import { AliasType } from "../Type/AliasType.ts";
import { BaseType } from "../Type/BaseType.ts";
import { LiteralType } from "../Type/LiteralType.ts";
import { UnionType } from "../Type/UnionType.ts";

function* _extractLiterals(type: BaseType | undefined): Iterable<string> {
  if (!type) {
    return;
  }
  if (type instanceof LiteralType) {
    yield type.getValue().toString();
    return;
  }
  if (type instanceof UnionType) {
    for (const t of type.getTypes()) {
      yield* _extractLiterals(t);
    }
    return;
  }
  if (type instanceof AliasType) {
    yield* _extractLiterals(type.getType());
    return;
  }

  throw new UnknownTypeError(type);
}

export function extractLiterals(type: BaseType | undefined): string[] {
  return [..._extractLiterals(type)];
}
