import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    /**
     * Opens the file.
     *
     * Preconditions:
     *  - file must currently be CLOSED
     */
    public open(): void {
        IllegalArgumentException.assert(
            this.state === FileState.CLOSED,
            "file must be closed before opening"
        );
        this.state = FileState.OPEN;
    }

    /**
     * Reads a number of bytes from the file.
     *
     * Preconditions:
     *  - noBytes must be >= 0
     *  - file must be OPEN
     */
    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(
            Number.isInteger(noBytes),
            "number of bytes to read must be an integer"
        );
        IllegalArgumentException.assert(
            noBytes >= 0,
            "number of bytes to read must be non-negative"
        );
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be open for reading"
        );

        return new Int8Array(noBytes);
    }

    /**
     * Closes the file.
     *
     * Preconditions:
     *  - file must be OPEN
     */
    public close(): void {
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be open before it can be closed"
        );
        this.state = FileState.CLOSED;
    }

    /**
     * Returns the current state (helper).
     */
    public getFileState(): FileState {
        return this.state;
    }
}