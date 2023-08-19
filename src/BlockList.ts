import Block from './Block.js';

const BLOCK_OPEN = '# !ignorefile-merge block-open';
const BLOCK_CLOSE = '# !ignorefile-merge block-close';
const BLOCK_MESSAGE = [
  '# ---------------------------------------------------------------',
  '# This block generated automatically',
  '# @see https://www.npmjs.com/package/ignorefile-merge',
  '# ---------------------------------------------------------------',
].join('\n');

export interface IBlockListOptions {
  name?: string;
  replace?: boolean;
}

export default class BlockList {
  #blocks: Block[] = [];
  #mapping = new Map<string, Block>();
  #name: string | undefined;

  constructor(content: string, options?: IBlockListOptions) {
    this.#name = options?.name;

    const rows = this.replaceBlock(content, !!options?.replace)
      .split('\n')
      .map(row => row.trim())
      .reverse();
    let row: string | undefined;
    let comments: string[] = [];

    while (rows.length) {
      row = rows.pop();

      if (row !== undefined) {
        if (!row.length) comments = this.appendRows(comments, !!rows.length);
        else if (row.charAt(0) === '#') comments.push(row);
        else {
          if (!this.#mapping.has(row)) {
            comments = this.appendRows(comments);
            this.appendBlock({ content: row });
          } else {
            comments = [];
          }
        }
      }
    }

    this.removeLastEmptyRow();
  }

  get patterns(): Block[] {
    return [...this.#mapping.values()];
  }

  hasBlock(block: Block): boolean {
    return !!block.content && this.#mapping.has(block.content);
  }

  join(wrap?: boolean): string {
    const content = this.#blocks.map(block => block.content).join('\n');
    const openLine = this.#name ? `${BLOCK_OPEN} ${this.#name}` : BLOCK_OPEN;
    const closeLine = this.#name ? `${BLOCK_CLOSE} ${this.#name}` : BLOCK_CLOSE;

    return wrap ? ['', openLine, BLOCK_MESSAGE, '', content, '', closeLine, ''].join('\n') : content;
  }

  private appendBlock({ content, mapped = true }: { content: string; mapped?: boolean }): void {
    const block = new Block(content, mapped);

    if (mapped) this.#mapping.set(block.content, block);

    this.#blocks.push(block);
  }

  private appendRows(rows: string[], withEmptyRowAfter?: boolean): string[] {
    if (rows.length) this.appendBlock({ content: rows.join('\n'), mapped: false });

    if (withEmptyRowAfter) {
      const lastBlock = this.#blocks[this.#blocks.length - 1];

      if (lastBlock?.isMapped || lastBlock?.content) this.appendBlock({ content: '', mapped: false });
    }

    return [];
  }

  private removeLastEmptyRow(): void {
    const lastBlock = this.#blocks[this.#blocks.length - 1];

    if (!lastBlock?.isMapped && !lastBlock?.content) this.#blocks.pop();
  }

  private replaceBlock(content: string, replace: boolean): string {
    let result = content;

    if (replace) {
      const pattern = this.#name
        ? `(${BLOCK_OPEN} ${this.#name})[\\S\\s]+(${BLOCK_CLOSE} ${this.#name})`
        : `(${BLOCK_OPEN})[\\S\\s]+(${BLOCK_CLOSE})`;

      result = content.replace(new RegExp(pattern, 'gm'), '');
    }

    return result;
  }
}
