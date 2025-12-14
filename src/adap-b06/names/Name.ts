import { Equality } from "../common/Equality";
import { Printable } from "../common/Printable";

export interface Name extends Equality, Printable {
  first(): string;
  last(): string;
}
