import ts from "../tsAdapter.ts";
import { symbolAtNode } from "./symbolAtNode.ts";

export function hasJsDocTag(node: ts.Node, tagName: string): boolean {
  const symbol = symbolAtNode(node);
  return symbol
    ? symbol.getJsDocTags()?.some((tag) => tag.name === tagName)
    : false;
}
