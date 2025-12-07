// src/adap-b05/files/Node.ts
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Name } from "../names/Name";

/**
 * Base Node class.
 *
 * Important: avoid runtime imports of Directory/RootNode here to prevent
 * circular import issues. Instead, subclasses override the
 * isDirectory(), isRoot() and getChildNodes() hooks.
 */
export class Node {

    protected baseName: string = "";
    protected parentNode: any; // keep loose type to avoid circular type imports

    constructor(bn: string, pn: any) {
        this.doSetBaseName(bn);
        this.parentNode = pn;
        this.initialize(pn);
    }

    protected initialize(pn: any): void {
        this.parentNode = pn;
        // Register with parent if parent exposes addChildNode
        if (this.parentNode && typeof (this.parentNode as any).addChildNode === "function") {
            (this.parentNode as any).addChildNode(this);
        }
    }

    public move(to: any): void {
        if (this.parentNode && typeof (this.parentNode as any).removeChildNode === "function") {
            (this.parentNode as any).removeChildNode(this);
        }
        if (to && typeof (to as any).addChildNode === "function") {
            (to as any).addChildNode(this);
        }
        this.parentNode = to;
    }

    public getFullName(): Name {
        // delegate to parent to build full name; assume parent provides getFullName()
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public rename(newName: string): void {
        if (newName === null || newName === undefined) {
            throw new IllegalArgumentException("name must be provided");
        }
        this.doSetBaseName(newName);
    }

    public getParentNode(): any {
        return this.parentNode;
    }

    /**
     * Hook: is this node a directory? subclasses should override.
     */
    public isDirectory(): boolean {
        return false;
    }

    /**
     * Hook: is this node the root node? subclasses (RootNode) override.
     */
    public isRoot(): boolean {
        return false;
    }

    /**
     * Hook: return child nodes for traversal.
     * Default: no children (empty set). Directory will override.
     */
    public getChildNodes(): Set<Node> {
        return new Set<Node>();
    }

    /**
     * findNodes: depth-first search for nodes whose base name equals bn.
     * - If reading a node's base name throws InvalidStateException, wrap it in a ServiceFailureException.
     */
    public findNodes(bn: string): Set<Node> {
        if (bn === null || bn === undefined) {
            throw new IllegalArgumentException("basename must be provided");
        }

        const result = new Set<Node>();
        const stack: Node[] = [this];

        while (stack.length > 0) {
            const node = stack.pop() as Node;

            // attempt to read base name; wrap InvalidStateException into ServiceFailureException
            let name: string;
            try {
                name = node.getBaseName();
                // treat empty name as invalid state, except for RootNode
                if ((name === "" || name === undefined || name === null) && !node.isRoot()) {
                    throw new InvalidStateException("invalid base name");
                }
            } catch (err: any) {
                if (err instanceof InvalidStateException) {
                    throw new ServiceFailureException("service failure while reading node", err);
                }
                throw err;
            }

            if (name === bn) {
                result.add(node);
            }

            // if directory, push children using hook (no runtime import)
            if (node.isDirectory()) {
                const children = node.getChildNodes();
                for (const c of children) {
                    stack.push(c);
                }
            }
        }

        return result;
    }

}
