import { Name } from "./Name";

export class PersonName implements Name {

  private readonly _first: string;
  private readonly _last: string;

  constructor(first: string, last: string) {
    if (!first || !last) {
      throw new Error("First and last name must be non-empty");
    }
    this._first = first;
    this._last = last;
  }

  // ---------- Name ----------
  first(): string {
    return this._first;
  }

  last(): string {
    return this._last;
  }

  // ---------- Equality ----------
  isEqual(other: unknown): boolean {
    return (
      other instanceof PersonName &&
      this._first === other._first &&
      this._last === other._last
    );
  }

  getHashCode(): number {
    let hash = 17;
    hash = hash * 31 + this.stringHash(this._first);
    hash = hash * 31 + this.stringHash(this._last);
    return hash;
  }

  // ---------- Printable ----------
  asString(): string {
    return `${this._first} ${this._last}`;
  }

  asDataString(): string {
    return `${this._first}${this.getDelimiterCharacter()}${this._last}`;
  }

  getDelimiterCharacter(): string {
    return " ";
  }

  // ---------- Helper ----------
  private stringHash(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0; 
    }
    return hash;
  }
}
