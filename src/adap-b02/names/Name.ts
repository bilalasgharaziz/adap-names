import { Printable, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 */
export interface Name extends Printable {

    /** Returns number of components in this name */
    getNoComponents(): number;

    /** Returns component i (0-based). Throws on out-of-bounds. */
    getComponent(i: number): string;

    /** Expects that new Name component c is properly masked */
    setComponent(i: number, c: string): void;

    /** Expects that new Name component c is properly masked */
    insert(i: number, c: string): void;

    /** Expects that new Name component c is properly masked */
    append(c: string): void;

    /** Removes component at i (no-op if out of bounds) */
    remove(i: number): void;

    /** Appends all components of other to this */
    concat(other: Name): void;
}
