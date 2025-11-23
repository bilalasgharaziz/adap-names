import { Name } from "./Name";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";

// Shared base class providing all logic for component handling.
// Subclasses only store their parts and implement getParts/setParts/clone.

export abstract class AbstractName implements Name {
    protected delimiter: string;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    // Subclasses must expose their component list (always strings)
    protected abstract getParts(): string[];
    protected abstract setParts(parts: string[]): void;

    // escaping helpers

protected escapeComponent(part: string): string {
    const esc = ESCAPE_CHARACTER.replace(/\\/g, "\\\\");  // escape for regex
    const del = this.delimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"); // escape delimiter for regex

    const escRegex = new RegExp(esc, "g");
    const delimRegex = new RegExp(del, "g");

    return part
        .replace(escRegex, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
        .replace(delimRegex, ESCAPE_CHARACTER + this.delimiter);
}


    protected unescapeComponent(part: string): string {
        const esc = ESCAPE_CHARACTER;
        let out = "";
        let escaping = false;

        for (const ch of part) {
            if (escaping) {
                out += ch;
                escaping = false;
            } else if (ch === esc) {
                escaping = true;
            } else {
                out += ch;
            }
        }
        return out;
    }

    // Split string into components while honoring escape sequences.
    protected splitEscaped(value: string): string[] {
        const esc = ESCAPE_CHARACTER;
        const delim = this.delimiter;

        const result: string[] = [];
        let current = "";
        let escaping = false;

        for (const ch of value) {
            if (escaping) {
                current += ch;
                escaping = false;
            } else if (ch === esc) {
                escaping = true;
            } else if (ch === delim) {
                result.push(this.unescapeComponent(current));
                current = "";
            } else {
                current += ch;
            }
        }

        result.push(this.unescapeComponent(current));
        return result;
    }

    //   Name interface implementations  

    asString(): string {
        return this.getParts()
            .map(p => this.escapeComponent(p))
            .join(this.delimiter);
    }

    toString(): string {
        return this.asString();
    }

    getComponent(index: number): string {
        return this.getParts()[index];
    }

    getNoComponents(): number {
        return this.getParts().length;
    }

    insert(index: number, value: string): void {
        const parts = this.getParts();
        parts.splice(index, 0, value);
        this.setParts(parts);
    }

    append(value: string): void {
        const parts = this.getParts();
        parts.push(value);
        this.setParts(parts);
    }

    prepend(value: string): void {
        const parts = this.getParts();
        parts.unshift(value);
        this.setParts(parts);
    }

    remove(index: number): void {
        const parts = this.getParts();
        parts.splice(index, 1);
        this.setParts(parts);
    }

    replace(index: number, value: string): void {
        const parts = this.getParts();
        parts[index] = value;
        this.setParts(parts);
    }

equals(other: Name): boolean {
    const a = this.getParts();
    const len = other.getNoComponents();

    if (a.length !== len) return false;

    for (let i = 0; i < len; i++) {
        if (a[i] !== other.getComponent(i)) return false;
    }
    return true;
}

contains(other: Name): boolean {
    const a = this.getParts();
    const bLen = other.getNoComponents();

    if (bLen === 0) return true;
    if (a.length < bLen) return false;

    outer: for (let i = 0; i <= a.length - bLen; i++) {
        for (let j = 0; j < bLen; j++) {
            if (a[i + j] !== other.getComponent(j)) continue outer;
        }
        return true;
    }
    return false;
}

isPrefixOf(other: Name): boolean {
    const a = this.getParts();
    const bLen = other.getNoComponents();

    if (a.length > bLen) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== other.getComponent(i)) return false;
    }
    return true;
}

commonPrefix(other: Name): Name {
    const a = this.getParts();
    const max = Math.min(a.length, other.getNoComponents());
    const prefix: string[] = [];

    for (let i = 0; i < max; i++) {
        if (a[i] !== other.getComponent(i)) break;
        prefix.push(a[i]);
    }

    const original = [...a];
    this.setParts(prefix);
    const result = this.clone();
    this.setParts(original); // restore original state
    return result;
}

concat(other: Name): void {
    const extra: string[] = [];
    for (let i = 0; i < other.getNoComponents(); i++) {
        extra.push(other.getComponent(i));
    }

    const combined = [...this.getParts(), ...extra];
    this.setParts(combined);
}


    abstract clone(): Name;
}
