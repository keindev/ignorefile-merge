export default class Block {
  readonly #content: undefined | string = undefined;
  #ignore: boolean = false;
  readonly #mapped: boolean = false;

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
