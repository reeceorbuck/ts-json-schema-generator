import { Definition } from "./Schema/Definition.ts";
import { BaseType } from "./Type/BaseType.ts";

export interface TypeFormatter {
  getDefinition(type: BaseType): Definition;
  getChildren(type: BaseType): BaseType[];
}
