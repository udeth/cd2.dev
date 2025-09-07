#!/usr/bin/env node

/**
 * 自动提取国际化文本工具
 * 扫描代码中的 t() 调用，自动提取需要翻译的文本
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class I18nExtractor {
  constructor(options = {}) {
    this.srcDir = options.srcDir || path.join(__dirname, '../src');
    this.localesDir = options.localesDir || path.join(__dirname, '../src/locales/langs');
    this.defaultNamespace = options.defaultNamespace || 'common';
    this.sourceLocale = options.sourceLocale || 'en';
    this.extractedKeys = new Set();
    this.keyUsage = new Map(); // 跟踪key的使用情况
  }

  // 扫描文件中的 t() 调用
  extractFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const keys = [];

      // 匹配各种 t() 调用模式
      const patterns = [
        // t('key')
        /t\(['"`]([^'"`]+)['"`]\)/g,
        // t("key")
        /t\(["']([^"']+)["']\)/g,
        // t(`key`)
        /t\(`([^`]+)`\)/g,
        // tMessages('key')
        /tMessages\(['"`]([^'"`]+)['"`]\)/g,
      ];

      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const key = match[1];
          keys.push(key);
          
          // 记录使用情况
          if (!this.keyUsage.has(key)) {
            this.keyUsage.set(key, []);
          }
          this.keyUsage.get(key).push({
            file: filePath,
            line: this.getLineNumber(content, match.index),
          });
        }
      });

      return keys;
    } catch (error) {
      console.warn(`无法提取文件 ${filePath}:`, error.message);
      return [];
    }
  }

  // 获取字符在文件中的行号
  getLineNumber(content, index) {
    return content.slice(0, index).split('\n').length;
  }

  // 递归扫描目录
  scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳过 node_modules 和其他不需要的目录
        if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
          this.scanDirectory(fullPath);
        }
      } else if (file.match(/\.(tsx?|jsx?)$/)) {
        const keys = this.extractFromFile(fullPath);
        keys.forEach(key => this.extractedKeys.add(key));
      }
    }
  }

  // 解析键路径 (例: "user.profile.name" -> { namespace: "user", key: "profile.name" })
  parseKey(keyStr) {
    const parts = keyStr.split('.');
    if (parts.length === 1) {
      return { namespace: this.defaultNamespace, key: keyStr };
    }
    
    // 检查是否是命名空间.key的格式
    const possibleNamespace = parts[0];
    const namespacePath = path.join(this.localesDir, this.sourceLocale, `${possibleNamespace}.json`);
    
    if (fs.existsSync(namespacePath)) {
      return { namespace: possibleNamespace, key: parts.slice(1).join('.') };
    }
    
    return { namespace: this.defaultNamespace, key: keyStr };
  }

  // 设置嵌套对象的值
  setNestedValue(obj, keyPath, value) {
    const keys = keyPath.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  // 获取嵌套对象的值
  getNestedValue(obj, keyPath) {
    const keys = keyPath.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current)) {
        return undefined;
      }
      current = current[key];
    }
    
    return current;
  }

  // 生成缺失的键
  generateMissingKeys() {
    console.log('🔍 扫描代码中的翻译键...');
    this.scanDirectory(this.srcDir);
    
    console.log(`📝 找到 ${this.extractedKeys.size} 个翻译键`);
    
    // 按命名空间分组
    const keysByNamespace = new Map();
    
    for (const keyStr of this.extractedKeys) {
      const { namespace, key } = this.parseKey(keyStr);
      
      if (!keysByNamespace.has(namespace)) {
        keysByNamespace.set(namespace, new Set());
      }
      keysByNamespace.get(namespace).add(key);
    }

    // 检查每个命名空间文件
    const missingKeys = new Map();
    
    for (const [namespace, keys] of keysByNamespace) {
      const filePath = path.join(this.localesDir, this.sourceLocale, `${namespace}.json`);
      let existingData = {};
      
      if (fs.existsSync(filePath)) {
        try {
          existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
          console.warn(`无法解析 ${filePath}:`, error.message);
        }
      }

      const missing = [];
      for (const key of keys) {
        if (this.getNestedValue(existingData, key) === undefined) {
          missing.push(key);
        }
      }

      if (missing.length > 0) {
        missingKeys.set(namespace, { file: filePath, keys: missing, existingData });
      }
    }

    return missingKeys;
  }

  // 生成翻译模板
  async generateTemplate(options = {}) {
    const { dryRun = false, addPlaceholders = true } = options;
    
    const missingKeys = this.generateMissingKeys();
    
    if (missingKeys.size === 0) {
      console.log('✅ 没有发现缺失的翻译键！');
      return;
    }

    console.log(`\n🛠️  发现 ${Array.from(missingKeys.values()).reduce((sum, item) => sum + item.keys.length, 0)} 个缺失的翻译键`);

    for (const [namespace, { file, keys, existingData }] of missingKeys) {
      console.log(`\n📄 ${namespace}.json:`);
      
      const updatedData = { ...existingData };
      
      for (const key of keys) {
        const placeholder = addPlaceholders ? `[${key}]` : key.split('.').pop();
        this.setNestedValue(updatedData, key, placeholder);
        console.log(`  + ${key}: "${placeholder}"`);
      }

      if (dryRun) {
        console.log(`    [DRY RUN] 将更新: ${file}`);
      } else {
        // 确保目录存在
        const dir = path.dirname(file);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(file, JSON.stringify(updatedData, null, 2), 'utf8');
        console.log(`    ✅ 已更新: ${file}`);
      }
    }
  }

  // 生成使用报告
  generateUsageReport() {
    console.log('📊 翻译键使用报告\n');
    
    const sortedKeys = Array.from(this.keyUsage.entries())
      .sort(([, a], [, b]) => b.length - a.length);

    for (const [key, usages] of sortedKeys) {
      console.log(`🔑 ${key} (使用 ${usages.length} 次):`);
      usages.forEach(({ file, line }) => {
        const relativePath = path.relative(this.srcDir, file);
        console.log(`  - ${relativePath}:${line}`);
      });
      console.log();
    }
  }

  // 查找未使用的翻译键
  findUnusedKeys() {
    console.log('🔍 查找未使用的翻译键...');
    
    // 先扫描代码
    this.scanDirectory(this.srcDir);
    
    // 读取所有翻译文件
    const localeDir = path.join(this.localesDir, this.sourceLocale);
    if (!fs.existsSync(localeDir)) {
      console.log('❌ 源语言目录不存在');
      return;
    }

    const unusedKeys = [];
    const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const namespace = path.basename(file, '.json');
      const filePath = path.join(localeDir, file);
      
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const allKeys = this.flattenObject(data, namespace === this.defaultNamespace ? '' : namespace);
        
        for (const key of allKeys) {
          if (!this.extractedKeys.has(key)) {
            unusedKeys.push({ namespace, key, file: filePath });
          }
        }
      } catch (error) {
        console.warn(`无法解析 ${filePath}:`, error.message);
      }
    }

    if (unusedKeys.length === 0) {
      console.log('✅ 没有发现未使用的翻译键！');
    } else {
      console.log(`❌ 发现 ${unusedKeys.length} 个未使用的翻译键:`);
      unusedKeys.forEach(({ namespace, key }) => {
        console.log(`  - ${namespace}.${key}`);
      });
    }

    return unusedKeys;
  }

  // 展平嵌套对象
  flattenObject(obj, prefix = '') {
    const keys = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        keys.push(...this.flattenObject(value, fullKey));
      } else {
        keys.push(fullKey);
      }
    }
    
    return keys;
  }
}

// CLI 接口
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  let command = 'extract';
  
  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case 'extract':
      case 'unused':
      case 'report':
        command = args[i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--no-placeholders':
        options.addPlaceholders = false;
        break;
      case '--help':
        console.log(`
使用方法: node scripts/i18n-extract.js [命令] [选项]

命令:
  extract    提取缺失的翻译键并生成模板 (默认)
  unused     查找未使用的翻译键
  report     生成翻译键使用报告

选项:
  --dry-run           模拟运行，不实际修改文件
  --no-placeholders   不添加占位符，使用键名作为默认值
  --help              显示帮助信息
        `);
        return;
    }
  }

  const extractor = new I18nExtractor();

  switch (command) {
    case 'extract':
      await extractor.generateTemplate(options);
      break;
    case 'unused':
      extractor.findUnusedKeys();
      break;
    case 'report':
      extractor.scanDirectory(extractor.srcDir);
      extractor.generateUsageReport();
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default I18nExtractor;