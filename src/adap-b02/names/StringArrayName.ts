import { Printable, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
// Internal helpers for escaping/splitting with support for ESCAPE and delimiter.
export function escapeComponent(raw: string, delimiter: string): string {
    let out = "";
    for (const ch of raw) {
        if (ch === ESCAPE_CHARACTER || ch === delimiter) {
            out += ESCAPE_CHARACTER;
        }
        out += ch;
    }
    return out;
}

export function unescapeComponent(masked: string): string {
    let out = "";
    let esc = false;
    for (const ch of masked) {
        if (esc) {
            out += ch;
            esc = false;
        } else if (ch === ESCAPE_CHARACTER) {
            esc = true;
        } else {
            out += ch;
        }
    }
    if (esc) out += ESCAPE_CHARACTER; // dangling escape: keep it
    return out;
}

export function splitMasked(value: string, delimiter: string): string[] {
    if (value.length === 0) return [];
    const parts: string[] = [];
    let buf = "";
    let esc = false;
    for (const ch of value) {
        if (esc) {
            buf += ch;
            esc = false;
        } else if (ch === ESCAPE_CHARACTER) {
            esc = true;
        } else if (ch === delimiter) {
            parts.push(buf);
            buf = "";
        } else {
            buf += ch;
        }
    }
    parts.push(buf);
    return parts;
}


/** Array-backed implementation */
export class StringArrayName implements Name {
    private parts: string[];
    private delimiter: string;

    constructor(parts: string[] = [], delimiter: string = DEFAULT_DELIMITER) {
        // store parts unescaped
        this.parts = [...parts];
        this.delimiter = delimiter;
    }

    getDelimiterCharacter(): string { return this.delimiter; }

    getNoComponents(): number { return this.parts.length; }

    getComponent(i: number): string {
        if (i < 0 || i >= this.parts.length) throw new Error("index out of bounds");
        return this.parts[i];
    }

    setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.parts.length) throw new Error("index out of bounds");
        this.parts[i] = c;
    }

    insert(i: number, c: string): void {
        let index = i;
        if (index < 0) index = 0;
        if (index > this.parts.length) index = this.parts.length;
        this.parts.splice(index, 0, c);
    }

    append(c: string): void { this.parts.push(c); }

    remove(i: number): void {
        if (i < 0 || i >= this.parts.length) return;
        this.parts.splice(i, 1);
    }

    concat(other: Name): void {
        // Prefer other.getNoComponents/getComponent when available
        const anyOther: any = other as any;
        if (typeof anyOther.getNoComponents === "function" && typeof anyOther.getComponent === "function") {
            const n = anyOther.getNoComponents();
            for (let i = 0; i < n; i++) this.parts.push(anyOther.getComponent(i));
            return;
        }
        // Fallback: split other's string using our delimiter
        const comps = splitMasked(other.asString(this.delimiter), this.delimiter);
        this.parts.push(...comps);
    }

    asString(delimiter?: string): string {
        const d = delimiter ?? this.delimiter;
        // human-readable: no escaping
        return this.parts.join(d);
    }

    asDataString(): string {
        // machine-readable with DEFAULT_DELIMITER and escaping
        return this.parts.map(p => escapeComponent(p, DEFAULT_DELIMITER)).join(DEFAULT_DELIMITER);
    }
}
