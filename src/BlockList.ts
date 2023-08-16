import Block from './Block.js';

const GENERATED_BLOCK_OPEN_ROW = '\n# !ignorefile-merge block-open';
const GENERATED_BLOCK_CLOSE_ROW = '# !ignorefile-merge block-close\n';
const GENERATED_PATTERN_EXPRESSION = /(# !ignorefile-merge block-open)[\S\s]+(# !ignorefile-merge block-close)/gm;
const GENERATED_BLOCK_MESSAGE = [
  '# ---------------------------------------------------------------',
  '# This block generated automatically',
  '# @see https://www.npmjs.com/package/ignorefile-merge',
  '# ---------------------------------------------------------------',
].join('\n');

export default class BlockList {
  #blocks: Block[] = [];
  #mapping = new Map<string, Block>();

  constructor(content: string, replaceGeneratedBlock?: boolean) {
    const rows = (replaceGeneratedBlock ? content.replace(GENERATED_PATTERN_EXPRESSION, '') : content)
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
          comments = this.appendRows(comments);
          this.appendBlock({ content: row });
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

    return wrap
      ? [GENERATED_BLOCK_OPEN_ROW, GENERATED_BLOCK_MESSAGE, '', content, '', GENERATED_BLOCK_CLOSE_ROW].join('\n')
      : content;
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
}
