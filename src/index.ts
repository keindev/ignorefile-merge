import BlockList from './BlockList.js';

export const merge = (left: string, right: string): string => {
  const leftBlockList = new BlockList(left, true);
  const rightBlockList = new BlockList(right);

  rightBlockList.patterns.map(pattern => {
    if (leftBlockList.hasBlock(pattern)) pattern.ignore();
  });

  return [leftBlockList.join(), rightBlockList.join(true)].join('\n');
};
