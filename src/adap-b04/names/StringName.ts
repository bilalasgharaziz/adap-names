import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    /**
     * Creates a new name from a data string.
     *
     * Preconditions:
     *  - source must not be null or undefined
     *  - delimiter (if given) must be a single character and not the escape character
     */
    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        IllegalArgumentException.assert(source !== null && source !== undefined,
            "source string must not be null or undefined");

        this.name = source;
        this.noComponents = this.parseComponents().length;

        this.assertClassInvariant();
    }

    public clone(): Name {
        // cloning keeps the same data representation and delimiter
        return new StringName(this.name, this.delimiter);
    }


    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertValidIndexPrecondition(i);
        this.assertClassInvariant();
        const components = this.parseComponents();
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertValidIndexPrecondition(i);
        this.assertValidComponentPrecondition(c);

        const components = this.parseComponents();
        components[i] = c;
        this.rebuildFromComponents(components);

        MethodFailedException.assert(this.getComponent(i) === c,
            "setComponent failed to update component");

        this.assertClassInvariant();
    }

    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(),
            "index out of range for insert");
        this.assertValidComponentPrecondition(c);

        const components = this.parseComponents();
        const oldCount = components.length;
        components.splice(i, 0, c);
        this.rebuildFromComponents(components);

        MethodFailedException.assert(this.getNoComponents() === oldCount + 1,
            "insert must increase number of components by one");

        this.assertClassInvariant();
    }

    public append(c: string): void {
        this.assertValidComponentPrecondition(c);

        const components = this.parseComponents();
        const oldCount = components.length;
        components.push(c);
        this.rebuildFromComponents(components);

        MethodFailedException.assert(this.getNoComponents() === oldCount + 1,
            "append must increase number of components by one");

        this.assertClassInvariant();
    }

    public remove(i: number): void {
        this.assertValidIndexPrecondition(i);

        const components = this.parseComponents();
        const oldCount = components.length;
        components.splice(i, 1);
        this.rebuildFromComponents(components);

        MethodFailedException.assert(this.getNoComponents() === oldCount - 1,
            "remove must decrease number of components by one");

        this.assertClassInvariant();
    }


    /**
     * Parses the internal data string into an array of unescaped components.
     */
    protected parseComponents(): string[] {
        const components: string[] = [];
        let current = "";
        let escaped = false;

        for (const ch of this.name) {
            if (escaped) {
                current += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (ch === DEFAULT_DELIMITER) {
                components.push(current);
                current = "";
            } else {
                current += ch;
            }
        }
        components.push(current);
        return components;
    }

    protected rebuildFromComponents(components: string[]): void {
        const escaped = components.map(c => AbstractName.escapeComponent(c));
        this.name = escaped.join(DEFAULT_DELIMITER);
        this.noComponents = components.length;
    }

    protected assertValidIndexPrecondition(i: number): void {
        IllegalArgumentException.assert(Number.isInteger(i),
            "index must be an integer");
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(),
            "index out of range");
    }

    protected assertValidComponentPrecondition(c: string): void {
        IllegalArgumentException.assert(c !== null && c !== undefined,
            "component must not be null or undefined");
    }

}
