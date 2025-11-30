import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

/**
 * Name implementation backed by a simple string array.
 *
 * Each component is stored as one entry in the components array.
 */
export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        IllegalArgumentException.assert(source !== null && source !== undefined,
            "source components must not be null");

        // defensive copy
        this.components = source.slice();

        // postcondition: number of components matches length of source array
        MethodFailedException.assert(this.getNoComponents() === source.length,
            "component count does not match source array length");

        this.assertClassInvariant();
    }

    public clone(): Name {
        // clone shares delimiter but must copy the underlying array
        return new StringArrayName(this.components.slice(), this.delimiter);
    }

    // ----- Name specific operations ----------------------------------------

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertValidIndexPrecondition(i);
        this.assertClassInvariant();
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.assertValidIndexPrecondition(i);
        this.assertValidComponentPrecondition(c);

        this.components[i] = c;

        MethodFailedException.assert(this.components[i] === c,
            "setComponent failed to update component");

        this.assertClassInvariant();
    }

    public insert(i: number, c: string): void {
        // valid positions are 0..noComponents
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(),
            "index out of range for insert");
        this.assertValidComponentPrecondition(c);

        const oldCount = this.getNoComponents();
        this.components.splice(i, 0, c);

        MethodFailedException.assert(this.getNoComponents() === oldCount + 1,
            "insert must increase number of components by one");

        this.assertClassInvariant();
    }

    public append(c: string): void {
        this.assertValidComponentPrecondition(c);

        const oldCount = this.getNoComponents();
        this.components.push(c);

        MethodFailedException.assert(this.getNoComponents() === oldCount + 1,
            "append must increase number of components by one");

        this.assertClassInvariant();
    }

    public remove(i: number): void {
        this.assertValidIndexPrecondition(i);

        const oldCount = this.getNoComponents();
        this.components.splice(i, 1);

        MethodFailedException.assert(this.getNoComponents() === oldCount - 1,
            "remove must decrease number of components by one");

        this.assertClassInvariant();
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
