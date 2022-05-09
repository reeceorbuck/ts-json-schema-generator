import ts from "../tsAdapter.ts";
import { hasJsDocTag } from "./hasJsDocTag.ts";

export function isNodeHidden(node: ts.Node): boolean {
  return hasJsDocTag(node, "hidden");
}
