// src/adap-b05/files/Directory.ts
import { Node } from "./Node";

/**
 * Directory extends Node and provides child storage.
 * Directory overrides isDirectory() and getChildNodes() so Node.findNodes()
 * can operate without importing Directory at runtime.
 */
export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: any) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn);
    }

    public getChildNodes(): Set<Node> {
        return this.childNodes;
    }

    public isDirectory(): boolean {
        return true;
    }
}
