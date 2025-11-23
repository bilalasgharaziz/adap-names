import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { DEFAULT_DELIMITER } from "../common/Printable";

// A name represented as a single string component.
// Internally stored as one-element array for unified handling.

export class StringName extends AbstractName {
    private value: string;

    constructor(value: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        this.value = value;
    }

    protected getParts(): string[] {
        return this.splitEscaped(this.value);
    }

    protected setParts(parts: string[]): void {
        this.value = parts.join(this.delimiter);
    }

    clone(): Name {
        return new StringName(this.value, this.delimiter);
    }
}
