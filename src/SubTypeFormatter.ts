import { BaseType } from "./Type/BaseType.ts";
import { TypeFormatter } from "./TypeFormatter.ts";

export interface SubTypeFormatter extends TypeFormatter {
  supportsType(type: BaseType): boolean;
}
