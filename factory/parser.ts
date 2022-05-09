import ts from "../src/tsAdapter.ts";
import { BasicAnnotationsReader } from "../src/AnnotationsReader/BasicAnnotationsReader.ts";
import { ExtendedAnnotationsReader } from "../src/AnnotationsReader/ExtendedAnnotationsReader.ts";
import { ChainNodeParser } from "../src/ChainNodeParser.ts";
import { CircularReferenceNodeParser } from "../src/CircularReferenceNodeParser.ts";
import { Config, DEFAULT_CONFIG } from "../src/Config.ts";
import { ExposeNodeParser } from "../src/ExposeNodeParser.ts";
import { MutableParser } from "../src/MutableParser.ts";
import { NodeParser } from "../src/NodeParser.ts";
import { AnnotatedNodeParser } from "../src/NodeParser/AnnotatedNodeParser.ts";
import { AnyTypeNodeParser } from "../src/NodeParser/AnyTypeNodeParser.ts";
import { ArrayLiteralExpressionNodeParser } from "../src/NodeParser/ArrayLiteralExpressionNodeParser.ts";
import { ArrayNodeParser } from "../src/NodeParser/ArrayNodeParser.ts";
import { AsExpressionNodeParser } from "../src/NodeParser/AsExpressionNodeParser.ts";
import { BooleanLiteralNodeParser } from "../src/NodeParser/BooleanLiteralNodeParser.ts";
import { BooleanTypeNodeParser } from "../src/NodeParser/BooleanTypeNodeParser.ts";
import { CallExpressionParser } from "../src/NodeParser/CallExpressionParser.ts";
import { ConditionalTypeNodeParser } from "../src/NodeParser/ConditionalTypeNodeParser.ts";
import { EnumNodeParser } from "../src/NodeParser/EnumNodeParser.ts";
import { ExpressionWithTypeArgumentsNodeParser } from "../src/NodeParser/ExpressionWithTypeArgumentsNodeParser.ts";
import { FunctionNodeParser } from "../src/NodeParser/FunctionNodeParser.ts";
import { FunctionParser } from "../src/NodeParser/FunctionParser.ts";
import { HiddenNodeParser } from "../src/NodeParser/HiddenTypeNodeParser.ts";
import { IndexedAccessTypeNodeParser } from "../src/NodeParser/IndexedAccessTypeNodeParser.ts";
import { InterfaceAndClassNodeParser } from "../src/NodeParser/InterfaceAndClassNodeParser.ts";
import { IntersectionNodeParser } from "../src/NodeParser/IntersectionNodeParser.ts";
import { IntrinsicNodeParser } from "../src/NodeParser/IntrinsicNodeParser.ts";
import { LiteralNodeParser } from "../src/NodeParser/LiteralNodeParser.ts";
import { MappedTypeNodeParser } from "../src/NodeParser/MappedTypeNodeParser.ts";
import { NeverTypeNodeParser } from "../src/NodeParser/NeverTypeNodeParser.ts";
import { NullLiteralNodeParser } from "../src/NodeParser/NullLiteralNodeParser.ts";
import { NumberLiteralNodeParser } from "../src/NodeParser/NumberLiteralNodeParser.ts";
import { NumberTypeNodeParser } from "../src/NodeParser/NumberTypeNodeParser.ts";
import { ObjectLiteralExpressionNodeParser } from "../src/NodeParser/ObjectLiteralExpressionNodeParser.ts";
import { ObjectTypeNodeParser } from "../src/NodeParser/ObjectTypeNodeParser.ts";
import { OptionalTypeNodeParser } from "../src/NodeParser/OptionalTypeNodeParser.ts";
import { ParameterParser } from "../src/NodeParser/ParameterParser.ts";
import { ParenthesizedNodeParser } from "../src/NodeParser/ParenthesizedNodeParser.ts";
import { PrefixUnaryExpressionNodeParser } from "../src/NodeParser/PrefixUnaryExpressionNodeParser.ts";
import { PropertyAccessExpressionParser } from "../src/NodeParser/PropertyAccessExpressionParser.ts";
import { RestTypeNodeParser } from "../src/NodeParser/RestTypeNodeParser.ts";
import { StringLiteralNodeParser } from "../src/NodeParser/StringLiteralNodeParser.ts";
import { StringTemplateLiteralNodeParser } from "../src/NodeParser/StringTemplateLiteralNodeParser.ts";
import { StringTypeNodeParser } from "../src/NodeParser/StringTypeNodeParser.ts";
import { SymbolTypeNodeParser } from "../src/NodeParser/SymbolTypeNodeParser.ts";
import { TupleNodeParser } from "../src/NodeParser/TupleNodeParser.ts";
import { TypeAliasNodeParser } from "../src/NodeParser/TypeAliasNodeParser.ts";
import { TypeLiteralNodeParser } from "../src/NodeParser/TypeLiteralNodeParser.ts";
import { TypeofNodeParser } from "../src/NodeParser/TypeofNodeParser.ts";
import { TypeOperatorNodeParser } from "../src/NodeParser/TypeOperatorNodeParser.ts";
import { TypeReferenceNodeParser } from "../src/NodeParser/TypeReferenceNodeParser.ts";
import { UndefinedTypeNodeParser } from "../src/NodeParser/UndefinedTypeNodeParser.ts";
import { UnionNodeParser } from "../src/NodeParser/UnionNodeParser.ts";
import { UnknownTypeNodeParser } from "../src/NodeParser/UnknownTypeNodeParser.ts";
import { VoidTypeNodeParser } from "../src/NodeParser/VoidTypeNodeParser.ts";
import { SubNodeParser } from "../src/SubNodeParser.ts";
import { TopRefNodeParser } from "../src/TopRefNodeParser.ts";

export type ParserAugmentor = (parser: MutableParser) => void;

export function createParser(
  program: ts.Program,
  config: Config,
  augmentor?: ParserAugmentor,
): NodeParser {
  const typeChecker = program.getTypeChecker();
  const chainNodeParser = new ChainNodeParser(typeChecker, []);

  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  function withExpose(nodeParser: SubNodeParser): SubNodeParser {
    return new ExposeNodeParser(
      typeChecker,
      nodeParser,
      mergedConfig.expose,
      mergedConfig.jsDoc,
    );
  }
  function withTopRef(nodeParser: NodeParser): NodeParser {
    return new TopRefNodeParser(
      chainNodeParser,
      mergedConfig.type,
      mergedConfig.topRef,
    );
  }
  function withJsDoc(nodeParser: SubNodeParser): SubNodeParser {
    const extraTags = new Set(mergedConfig.extraTags);
    if (mergedConfig.jsDoc === "extended") {
      return new AnnotatedNodeParser(
        nodeParser,
        new ExtendedAnnotationsReader(typeChecker, extraTags),
      );
    } else if (mergedConfig.jsDoc === "basic") {
      return new AnnotatedNodeParser(
        nodeParser,
        new BasicAnnotationsReader(extraTags),
      );
    } else {
      return nodeParser;
    }
  }
  function withCircular(nodeParser: SubNodeParser): SubNodeParser {
    return new CircularReferenceNodeParser(nodeParser);
  }

  if (augmentor) {
    augmentor(chainNodeParser);
  }

  chainNodeParser
    .addNodeParser(new HiddenNodeParser(typeChecker))
    .addNodeParser(new StringTypeNodeParser())
    .addNodeParser(new SymbolTypeNodeParser())
    .addNodeParser(new NumberTypeNodeParser())
    .addNodeParser(new BooleanTypeNodeParser())
    .addNodeParser(new AnyTypeNodeParser())
    .addNodeParser(new UnknownTypeNodeParser())
    .addNodeParser(new VoidTypeNodeParser())
    .addNodeParser(new UndefinedTypeNodeParser())
    .addNodeParser(new NeverTypeNodeParser())
    .addNodeParser(new ObjectTypeNodeParser())
    .addNodeParser(new AsExpressionNodeParser(chainNodeParser))
    .addNodeParser(new FunctionParser(chainNodeParser))
    .addNodeParser(withJsDoc(new ParameterParser(chainNodeParser)))
    .addNodeParser(new StringLiteralNodeParser())
    .addNodeParser(new StringTemplateLiteralNodeParser(chainNodeParser))
    .addNodeParser(new IntrinsicNodeParser())
    .addNodeParser(new NumberLiteralNodeParser())
    .addNodeParser(new BooleanLiteralNodeParser())
    .addNodeParser(new NullLiteralNodeParser())
    .addNodeParser(new FunctionNodeParser())
    .addNodeParser(new ObjectLiteralExpressionNodeParser(chainNodeParser))
    .addNodeParser(new ArrayLiteralExpressionNodeParser(chainNodeParser))
    .addNodeParser(new PrefixUnaryExpressionNodeParser(chainNodeParser))
    .addNodeParser(new LiteralNodeParser(chainNodeParser))
    .addNodeParser(new ParenthesizedNodeParser(chainNodeParser))
    .addNodeParser(new TypeReferenceNodeParser(typeChecker, chainNodeParser))
    .addNodeParser(
      new ExpressionWithTypeArgumentsNodeParser(typeChecker, chainNodeParser),
    )
    .addNodeParser(new IndexedAccessTypeNodeParser(chainNodeParser))
    .addNodeParser(new TypeofNodeParser(typeChecker, chainNodeParser))
    .addNodeParser(
      new MappedTypeNodeParser(
        chainNodeParser,
        mergedConfig.additionalProperties,
      ),
    )
    .addNodeParser(new ConditionalTypeNodeParser(typeChecker, chainNodeParser))
    .addNodeParser(new TypeOperatorNodeParser(chainNodeParser))
    .addNodeParser(new UnionNodeParser(typeChecker, chainNodeParser))
    .addNodeParser(new IntersectionNodeParser(typeChecker, chainNodeParser))
    .addNodeParser(new TupleNodeParser(typeChecker, chainNodeParser))
    .addNodeParser(new OptionalTypeNodeParser(chainNodeParser))
    .addNodeParser(new RestTypeNodeParser(chainNodeParser))
    .addNodeParser(new CallExpressionParser(typeChecker, chainNodeParser))
    .addNodeParser(
      new PropertyAccessExpressionParser(typeChecker, chainNodeParser),
    )
    .addNodeParser(
      withCircular(
        withExpose(
          withJsDoc(new TypeAliasNodeParser(typeChecker, chainNodeParser)),
        ),
      ),
    )
    .addNodeParser(withExpose(withJsDoc(new EnumNodeParser(typeChecker))))
    .addNodeParser(
      withCircular(
        withExpose(
          withJsDoc(
            new InterfaceAndClassNodeParser(
              typeChecker,
              withJsDoc(chainNodeParser),
              mergedConfig.additionalProperties,
            ),
          ),
        ),
      ),
    )
    .addNodeParser(
      withCircular(
        withExpose(
          withJsDoc(
            new TypeLiteralNodeParser(
              withJsDoc(chainNodeParser),
              mergedConfig.additionalProperties,
            ),
          ),
        ),
      ),
    )
    .addNodeParser(new ArrayNodeParser(chainNodeParser));

  return withTopRef(chainNodeParser);
}
