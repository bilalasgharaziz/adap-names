import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { DEFAULT_DELIMITER } from "../common/Printable";

// Represents a name as an ordered list of string components.

export class StringArrayName extends AbstractName {
    private parts: string[];

    constructor(parts: string[] | string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        // If string is provided → parse using escaping rules
        if (typeof parts === "string") {
            this.parts = this.splitEscaped(parts);
        } else {
            this.parts = [...parts];
        }
    }

    protected getParts(): string[] {
        return this.parts;
    }

    protected setParts(parts: string[]): void {
        this.parts = [...parts];
    }

    clone(): Name {
        return new StringArrayName([...this.parts], this.delimiter);
    }
}
