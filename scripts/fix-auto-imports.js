#!/usr/bin/env node
/**
 * 修复 auto-imports.d.ts 文件，移除 @ts-nocheck 注释
 * 以确保 TypeScript 能够正确识别全局类型声明
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const filePath = resolve(process.cwd(), 'auto-imports.d.ts');

try {
  let content = readFileSync(filePath, 'utf-8');
  
  // 移除 @ts-nocheck 注释
  if (content.includes('// @ts-nocheck')) {
    content = content.replace('// @ts-nocheck\n', '');
    writeFileSync(filePath, content, 'utf-8');
    console.log('✓ 已移除 auto-imports.d.ts 中的 @ts-nocheck 注释');
  }
} catch (error) {
  console.error('修复 auto-imports.d.ts 失败:', error.message);
  process.exit(1);
}
