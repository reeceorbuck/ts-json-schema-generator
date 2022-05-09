import { Config } from "../src/Config.ts";
import { ChainTypeFormatter } from "../src/ChainTypeFormatter.ts";
import { CircularReferenceTypeFormatter } from "../src/CircularReferenceTypeFormatter.ts";
import { TypeFormatter } from "../src/TypeFormatter.ts";
import { AliasTypeFormatter } from "../src/TypeFormatter/AliasTypeFormatter.ts";
import { AnnotatedTypeFormatter } from "../src/TypeFormatter/AnnotatedTypeFormatter.ts";
import { AnyTypeFormatter } from "../src/TypeFormatter/AnyTypeFormatter.ts";
import { SymbolTypeFormatter } from "../src/TypeFormatter/SymbolTypeFormatter.ts";
import { ArrayTypeFormatter } from "../src/TypeFormatter/ArrayTypeFormatter.ts";
import { BooleanTypeFormatter } from "../src/TypeFormatter/BooleanTypeFormatter.ts";
import { DefinitionTypeFormatter } from "../src/TypeFormatter/DefinitionTypeFormatter.ts";
import { EnumTypeFormatter } from "../src/TypeFormatter/EnumTypeFormatter.ts";
import { IntersectionTypeFormatter } from "../src/TypeFormatter/IntersectionTypeFormatter.ts";
import { LiteralTypeFormatter } from "../src/TypeFormatter/LiteralTypeFormatter.ts";
import { LiteralUnionTypeFormatter } from "../src/TypeFormatter/LiteralUnionTypeFormatter.ts";
import { NullTypeFormatter } from "../src/TypeFormatter/NullTypeFormatter.ts";
import { NumberTypeFormatter } from "../src/TypeFormatter/NumberTypeFormatter.ts";
import { ObjectTypeFormatter } from "../src/TypeFormatter/ObjectTypeFormatter.ts";
import { OptionalTypeFormatter } from "../src/TypeFormatter/OptionalTypeFormatter.ts";
import { PrimitiveUnionTypeFormatter } from "../src/TypeFormatter/PrimitiveUnionTypeFormatter.ts";
import { ReferenceTypeFormatter } from "../src/TypeFormatter/ReferenceTypeFormatter.ts";
import { RestTypeFormatter } from "../src/TypeFormatter/RestTypeFormatter.ts";
import { StringTypeFormatter } from "../src/TypeFormatter/StringTypeFormatter.ts";
import { TupleTypeFormatter } from "../src/TypeFormatter/TupleTypeFormatter.ts";
import { UndefinedTypeFormatter } from "../src/TypeFormatter/UndefinedTypeFormatter.ts";
import { UnionTypeFormatter } from "../src/TypeFormatter/UnionTypeFormatter.ts";
import { UnknownTypeFormatter } from "../src/TypeFormatter/UnknownTypeFormatter.ts";
import { VoidTypeFormatter } from "../src/TypeFormatter/VoidTypeFormatter.ts";
import { MutableTypeFormatter } from "../src/MutableTypeFormatter.ts";
import { NeverTypeFormatter } from "../src/TypeFormatter/NeverTypeFormatter.ts";

export type FormatterAugmentor = (
  formatter: MutableTypeFormatter,
  circularReferenceTypeFormatter: CircularReferenceTypeFormatter,
) => void;

export function createFormatter(
  config: Config,
  augmentor?: FormatterAugmentor,
): TypeFormatter {
  const chainTypeFormatter = new ChainTypeFormatter([]);
  const circularReferenceTypeFormatter = new CircularReferenceTypeFormatter(
    chainTypeFormatter,
  );

  if (augmentor) {
    augmentor(chainTypeFormatter, circularReferenceTypeFormatter);
  }

  chainTypeFormatter
    .addTypeFormatter(
      new AnnotatedTypeFormatter(circularReferenceTypeFormatter),
    )
    .addTypeFormatter(new StringTypeFormatter())
    .addTypeFormatter(new NumberTypeFormatter())
    .addTypeFormatter(new BooleanTypeFormatter())
    .addTypeFormatter(new NullTypeFormatter())
    .addTypeFormatter(new SymbolTypeFormatter())
    .addTypeFormatter(new AnyTypeFormatter())
    .addTypeFormatter(new UndefinedTypeFormatter())
    .addTypeFormatter(new UnknownTypeFormatter())
    .addTypeFormatter(new VoidTypeFormatter())
    .addTypeFormatter(new NeverTypeFormatter())
    .addTypeFormatter(new LiteralTypeFormatter())
    .addTypeFormatter(new EnumTypeFormatter())
    .addTypeFormatter(
      new ReferenceTypeFormatter(
        circularReferenceTypeFormatter,
        config.encodeRefs ?? true,
      ),
    )
    .addTypeFormatter(
      new DefinitionTypeFormatter(
        circularReferenceTypeFormatter,
        config.encodeRefs ?? true,
      ),
    )
    .addTypeFormatter(new ObjectTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new AliasTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new PrimitiveUnionTypeFormatter())
    .addTypeFormatter(new LiteralUnionTypeFormatter())
    .addTypeFormatter(new OptionalTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new RestTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new ArrayTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new TupleTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(new UnionTypeFormatter(circularReferenceTypeFormatter))
    .addTypeFormatter(
      new IntersectionTypeFormatter(circularReferenceTypeFormatter),
    );

  return circularReferenceTypeFormatter;
}
