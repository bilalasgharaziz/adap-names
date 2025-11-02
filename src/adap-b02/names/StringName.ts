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


/** String-backed implementation */
export class StringName implements Name {
    private value: string;
    private delimiter: string;

    constructor(value: string = "", delimiter: string = DEFAULT_DELIMITER) {
        this.value = value;
        this.delimiter = delimiter;
    }

    getDelimiterCharacter(): string { return this.delimiter; }

    private parts(): string[] { return splitMasked(this.value, this.delimiter); }

    private setParts(parts: string[]): void { this.value = parts.join(this.delimiter); }

    getNoComponents(): number { return this.value === "" ? 0 : this.parts().length; }

    getComponent(i: number): string {
        const p = this.parts();
        if (i < 0 || i >= p.length) throw new Error("index out of bounds");
        return p[i];
    }

    setComponent(i: number, c: string): void {
        const p = this.parts();
        if (i < 0 || i >= p.length) throw new Error("index out of bounds");
        p[i] = c;
        this.setParts(p);
    }

    insert(i: number, c: string): void {
        const p = this.parts();
        let idx = i;
        if (idx < 0) idx = 0;
        if (idx > p.length) idx = p.length;
        p.splice(idx, 0, c);
        this.setParts(p);
    }

    append(c: string): void {
        const p = this.parts();
        p.push(c);
        this.setParts(p);
    }

    remove(i: number): void {
        const p = this.parts();
        if (i < 0 || i >= p.length) return;
        p.splice(i, 1);
        this.setParts(p);
    }

    concat(other: Name): void {
        const p = this.parts();
        const anyOther: any = other as any;
        if (typeof anyOther.getNoComponents === "function" && typeof anyOther.getComponent === "function") {
            const n = anyOther.getNoComponents();
            for (let i = 0; i < n; i++) p.push(anyOther.getComponent(i));
        } else {
            p.push(...splitMasked(other.asString(this.delimiter), this.delimiter));
        }
        this.setParts(p);
    }

    asString(delimiter?: string): string {
        const d = delimiter ?? this.delimiter;
        // human-readable: no escaping; if delimiter differs, translate
        if (d === this.delimiter) return this.value;
        const p = this.parts();
        return p.join(d);
    }

    asDataString(): string {
        // machine-readable with DEFAULT_DELIMITER and escaping
        const p = this.parts();
        return p.map(x => escapeComponent(x, DEFAULT_DELIMITER)).join(DEFAULT_DELIMITER);
    }
}
