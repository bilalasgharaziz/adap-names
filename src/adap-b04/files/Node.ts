import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string;
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertValidBaseNameAsPrecondition(bn);
        this.assertValidParentAsPrecondition(pn);

        this.baseName = bn;
        this.parentNode = pn;
    }

    /**
     * Returns the base name (last component) of this node.
     */
    public getBaseName(): string {
        return this.baseName;
    }

    /**
     * Returns the parent directory.
     */
    public getParentNode(): Directory {
        return this.parentNode;
    }

    public rename(bn: string): void {
        this.assertValidBaseNameAsPrecondition(bn);
        this.baseName = bn;
    }


    protected assertValidBaseNameAsPrecondition(bn: string): void {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "base name must not be null or undefined"
        );
        IllegalArgumentException.assert(
            bn.length > 0,
            "base name must not be empty"
        );
        IllegalArgumentException.assert(
            !bn.includes("/"),
            "base name must not contain '/'"
        );
    }

    protected assertValidParentAsPrecondition(pn: Directory): void {
        IllegalArgumentException.assert(
            pn !== null && pn !== undefined,
            "parent directory must not be null or undefined"
        );
    }
}
