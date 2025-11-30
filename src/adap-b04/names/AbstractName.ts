import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    /**
     * Creates a new name instance using the given delimiter.
     *
     * Preconditions:
     *  - delimiter must be a single character
     *  - delimiter must not be the escape character
     */
    constructor(delimiter: string = DEFAULT_DELIMITER) {
        AbstractName.assertIsValidDelimiterAsPrecondition(delimiter);
        this.delimiter = delimiter;
        // Invariant will be checked by subclasses once their own state is initialised
    }

    /**
     * Subclasses must override clone so that they can create the correct concrete type.
     */
    public abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        AbstractName.assertIsValidDelimiterAsPrecondition(delimiter);

        const result = this.collectComponents().join(delimiter);

        MethodFailedException.assert(result !== undefined && result !== null,
            "asString produced an invalid result");

        this.assertClassInvariant();
        return result;
    }


    public asDataString(): string {
        const escapedComponents = this.collectComponents().map(c =>
            AbstractName.escapeComponent(c)
        );
        const result = escapedComponents.join(DEFAULT_DELIMITER);

        MethodFailedException.assert(result !== undefined && result !== null,
            "asDataString produced an invalid result");

        this.assertClassInvariant();
        return result;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        this.assertClassInvariant();
        return this.getNoComponents() === 0;
    }

    public isEqual(other: Object): boolean {
        if (other === this) {
            return true;
        }
        const otherName = other as Name | null;
        if (otherName == null ||
            typeof (otherName as any).asDataString !== "function") {
            return false;
        }
        return this.asDataString() === otherName.asDataString();
    }

    public getHashCode(): number {
        // simple string hash of the data representation
        const s = this.asDataString();
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = ((hash << 5) - hash) + s.charCodeAt(i);
            hash |= 0; // force 32-bit
        }
        return hash;
    }

    /**
     * Helper used by subclasses to materialise all components as an array.
     */
    protected collectComponents(): string[] {
        const components: string[] = [];
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            components.push(this.getComponent(i));
        }
        return components;
    }


    /**
     * Precondition for delimiter parameters.
     */
    protected static assertIsValidDelimiterAsPrecondition(delimiter: string): void {
        IllegalArgumentException.assert(delimiter !== undefined && delimiter !== null,
            "delimiter must not be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1,
            "delimiter must be a single character");
        IllegalArgumentException.assert(delimiter !== ESCAPE_CHARACTER,
            "delimiter must not be the escape character");
    }

    protected assertClassInvariant(): void {
        InvalidStateException.assert(this.delimiter.length === 1,
            "invalid delimiter length");
        InvalidStateException.assert(this.delimiter !== ESCAPE_CHARACTER,
            "delimiter equals escape character");
        InvalidStateException.assert(this.getNoComponents() >= 0,
            "negative number of name components");
    }

    /**
     * Escapes DEFAULT_DELIMITER and ESCAPE_CHARACTER inside one component.
     */
    protected static escapeComponent(component: string): string {
        let result = "";
        for (const ch of component) {
            if (ch === DEFAULT_DELIMITER || ch === ESCAPE_CHARACTER) {
                result += ESCAPE_CHARACTER;
            }
            result += ch;
        }
        return result;
    }


    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assert(other !== null && other !== undefined,
            "other name must not be null");

        const otherNoComponents = other.getNoComponents();
        for (let i = 0; i < otherNoComponents; i++) {
            const c = other.getComponent(i);
            this.append(c);
        }

        this.assertClassInvariant();
    }

}
