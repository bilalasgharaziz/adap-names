import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);
        if (tn !== undefined) {
            this.targetNode = tn;
        }
    }

    /**
     * Returns the current target node (may be null).
     */
    public getTargetNode(): Node | null {
        return this.targetNode;
    }
    public setTargetNode(tn: Node): void {
        IllegalArgumentException.assert(
            tn !== null && tn !== undefined,
            "target node must not be null or undefined"
        );
        this.targetNode = tn;
    }

    /**
     * Returns the base name of the target node.
     *
     * Preconditions (via ensureTargetNode):
     *  - link must have a non-null target
     */
    public getBaseNameOfTarget(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public renameTarget(bn: string): void {
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        IllegalArgumentException.assert(
            target !== null,
            "link has no target node"
        );
        return target as Node;
    }
}
