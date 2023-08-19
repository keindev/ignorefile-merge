import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line node/no-extraneous-import
import { jest } from '@jest/globals';

import { merge } from '../index.js';

jest.useFakeTimers();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const patternsDir = path.join(__dirname, 'patterns');

const originalIgnoreFileContent = fs.readFileSync(path.join(patternsDir, 'node.pattern')).toString();
const specificAIgnoreFileContent = fs.readFileSync(path.join(patternsDir, 'specific-a.pattern')).toString();
const specificBIgnoreFileContent = fs.readFileSync(path.join(patternsDir, 'specific-b.pattern')).toString();
const mergedIgnoreFileContent = fs.readFileSync(path.join(patternsDir, 'merged.pattern')).toString();
const mergedMultipleIgnoreFileContent = fs.readFileSync(path.join(patternsDir, 'merged-multiple.pattern')).toString();

describe('Merge ignore files', () => {
  it('Merge without generated block', () => {
    expect(merge(originalIgnoreFileContent, specificAIgnoreFileContent)).toBe(mergedIgnoreFileContent);
  });

  it('Merge with generated block', () => {
    expect(merge(mergedIgnoreFileContent, specificAIgnoreFileContent)).toBe(mergedIgnoreFileContent);
  });

  it('Merge multiple', () => {
    let result = originalIgnoreFileContent;

    result = merge(result, specificAIgnoreFileContent, { name: 'block-a' });
    result = merge(result, specificBIgnoreFileContent, { name: 'block-b' });

    expect(result).toBe(mergedMultipleIgnoreFileContent);
  });
});
