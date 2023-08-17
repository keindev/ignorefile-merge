export default class Block {
  #content: undefined | string = undefined;
  #ignore = false;
  #mapped = false;

  constructor(content?: string, mapped?: boolean) {
    this.#content = content;
    this.#mapped = !!mapped;
  }

  get isIgnore(): boolean {
    return this.#ignore;
  }

  get isMapped(): boolean {
    return this.#mapped;
  }

  get content(): string {
    const content = this.#content ?? '';

    return this.isIgnore ? `# ${content}` : content;
  }

  ignore(): void {
    this.#ignore = true;
  }
}
