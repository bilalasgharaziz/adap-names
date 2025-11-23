// Minimal interface required by all Name types.
// Includes every method used in the test suite.

export interface Name {
    asString(): string;                  // canonical serialized form
    toString(): string;                  // alias

    getComponent(index: number): string; // return component at index
    getNoComponents(): number;           // number of components

    insert(index: number, value: string): void;
    append(value: string): void;
    prepend(value: string): void;

    remove(index: number): void;
    replace(index: number, value: string): void;

    equals(other: Name): boolean;
    contains(other: Name): boolean;      // other is substring sequence
    isPrefixOf(other: Name): boolean;    // this is prefix of other
    commonPrefix(other: Name): Name;     // longest shared prefix

    concat(other: Name): void;           // append parts from other

    clone(): Name;                       // deep copy
}
