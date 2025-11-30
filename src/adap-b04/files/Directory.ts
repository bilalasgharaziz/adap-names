import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

/**
 * A Directory is a Node that can contain child nodes.
 */
export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    /**
     * Constructs a directory with the given base name and parent directory.
     * Node’s constructor already checks baseName + parent preconditions.
     */
    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    /**
     * Returns true if the given node is a direct child of this directory.
     *
     * Precondition:
     *  - cn must not be null / undefined
     */
    public hasChildNode(cn: Node): boolean {
        this.assertValidChildNodeAsPrecondition(cn);
        return this.childNodes.has(cn);
    }

    /**
     * Adds a child node to this directory.
     *
     * Preconditions:
     *  - cn must not be null / undefined
     *  - cn must not already be contained in this directory
     */
    public addChildNode(cn: Node): void {
        this.assertValidChildNodeAsPrecondition(cn);
        IllegalArgumentException.assert(
            !this.childNodes.has(cn),
            "child node already contained in directory"
        );
        this.childNodes.add(cn);
    }

    /**
     * Removes a child node from this directory.
     *
     * Preconditions:
     *  - cn must not be null / undefined
     *  - cn must currently be contained in this directory
     */
    public removeChildNode(cn: Node): void {
        this.assertValidChildNodeAsPrecondition(cn);
        IllegalArgumentException.assert(
            this.childNodes.has(cn),
            "child node not contained in directory"
        );
        this.childNodes.delete(cn); // (this is the homework's API; normally it'd be "remove")
    }

    /**
     * Returns an array of all child nodes (optional helper).
     */
    public getChildNodes(): Node[] {
        return Array.from(this.childNodes);
    }

    protected assertValidChildNodeAsPrecondition(cn: Node): void {
        IllegalArgumentException.assert(
            cn !== null && cn !== undefined,
            "child node must not be null or undefined"
        );
    }
}
