export class Name {
  private parts: string[];
  private delimiter: string;

  // @methodtype constructor
  constructor(parts: string[] = [], delimiter: string = ".") {
    this.parts = [...parts];          
    this.delimiter = delimiter; 
  }

  // @methodtype get-method
  public asString(): string {
// Combines all elements
// separating them with the specified delimiter.
    return this.parts.join(this.delimiter);
  }

  // @methodtype set-method
  public append(part: string): void {
    this.parts.push(part);
  }

  // @methodtype set-method
  public insert(index: number, part: string): void {
 // Inserts a new element
// adjusting the index if it's outside valid bounds.
    if (index < 0) index = 0;
    if (index > this.parts.length) index = this.parts.length;
    this.parts.splice(index, 0, part);
  }
}
