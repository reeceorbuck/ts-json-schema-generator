import { SubTypeFormatter } from "./SubTypeFormatter.ts";

export interface MutableTypeFormatter {
  addTypeFormatter(formatter: SubTypeFormatter): MutableTypeFormatter;
}
