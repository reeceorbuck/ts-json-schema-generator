import ts from "../tsAdapter.ts";
import { BaseError } from "./BaseError.ts";

export class UnknownNodeError extends BaseError {
  public constructor(private node: ts.Node, private reference?: ts.Node) {
    super(`Unknown node "${node.getFullText()}`);
  }

  public getNode(): ts.Node {
    return this.node;
  }

  public getReference(): ts.Node | undefined {
    return this.reference;
  }
}
