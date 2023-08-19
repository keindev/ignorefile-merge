import BlockList from './BlockList.js';

export interface IMergeOptions {
  name?: string;
}

export const merge = (left: string, right: string, options?: IMergeOptions): string => {
  const leftBlockList = new BlockList(left, { name: options?.name, replace: true });
  const rightBlockList = new BlockList(right, { name: options?.name });

  rightBlockList.patterns.map(pattern => {
    if (leftBlockList.hasBlock(pattern)) pattern.ignore();
  });

  return [leftBlockList.join(), rightBlockList.join(true)].join('\n');
};
