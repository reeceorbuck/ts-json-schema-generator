import ts from "./tsAdapter.ts";
import { Annotations } from "./Type/AnnotatedType.ts";

export interface AnnotationsReader {
  getAnnotations(node: ts.Node): Annotations | undefined;
}
