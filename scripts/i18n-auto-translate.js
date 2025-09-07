#!/usr/bin/env node

/**
 * 自动翻译工具
 * 使用方式：
 * 1. npm install google-translate-api-x openai axios
 * 2. 设置环境变量 OPENAI_API_KEY（可选，用于更高质量翻译）
 * 3. node scripts/i18n-auto-translate.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 语言配置
const LANGUAGES = {
  en: 'en',    // 源语言（英语）
  cn: 'zh-cn', // 中文
  fr: 'fr',    // 法语
  vi: 'vi',    // 越南语
  ar: 'ar',    // 阿拉伯语
};

// 支持的翻译服务
const TRANSLATION_SERVICES = {
  GOOGLE: 'google',
  OPENAI: 'openai',
  MANUAL: 'manual', // 手动翻译模式
};

class I18nAutoTranslator {
  constructor(options = {}) {
    this.sourceLocale = options.sourceLocale || 'en';
    this.localesDir = options.localesDir || path.join(__dirname, '../src/locales/langs');
    this.service = options.service || TRANSLATION_SERVICES.GOOGLE;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.excludeKeys = options.excludeKeys || []; // 排除不需要翻译的key
    this.cacheFile = path.join(__dirname, '.translation-cache.json');
    this.cache = this.loadCache();
  }

  // 加载翻译缓存
  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        return JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
      }
    } catch (error) {
      console.warn('无法加载翻译缓存:', error.message);
    }
    return {};
  }

  // 保存翻译缓存
  saveCache() {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.warn('无法保存翻译缓存:', error.message);
    }
  }

  // 生成缓存键
  getCacheKey(text, targetLang) {
    return `${this.sourceLocale}-${targetLang}-${Buffer.from(text).toString('base64')}`;
  }

  // Google Translate API 翻译
  async translateWithGoogle(text, targetLang) {
    try {
      // 注意：需要安装 google-translate-api-x
      const { translate } = await import('google-translate-api-x');
      const result = await translate(text, { from: LANGUAGES[this.sourceLocale], to: LANGUAGES[targetLang] });
      return result.text;
    } catch (error) {
      console.error(`Google 翻译失败 (${targetLang}):`, error.message);
      return null;
    }
  }

  // OpenAI GPT 翻译
  async translateWithOpenAI(text, targetLang) {
    if (!this.openaiApiKey) {
      throw new Error('需要设置 OPENAI_API_KEY 环境变量');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `你是一个专业的翻译助手。请将英文翻译成${this.getLanguageName(targetLang)}。
              要求：
              1. 保持原文的语气和风格
              2. 对于UI界面文本，使用简洁易懂的表达
              3. 保持技术术语的准确性
              4. 只返回翻译结果，不要包含其他内容`
            },
            {
              role: 'user',
              content: `请翻译以下文本：${text}`
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content.trim();
      }
      throw new Error('OpenAI API 响应格式错误');
    } catch (error) {
      console.error(`OpenAI 翻译失败 (${targetLang}):`, error.message);
      return null;
    }
  }

  // 获取语言名称
  getLanguageName(langCode) {
    const names = {
      cn: '中文',
      fr: '法语',
      vi: '越南语',
      ar: '阿拉伯语',
    };
    return names[langCode] || langCode;
  }

  // 翻译文本
  async translateText(text, targetLang) {
    const cacheKey = this.getCacheKey(text, targetLang);
    
    // 检查缓存
    if (this.cache[cacheKey]) {
      console.log(`使用缓存翻译: ${text} -> ${targetLang}`);
      return this.cache[cacheKey];
    }

    let translation = null;

    // 根据服务选择翻译方法
    switch (this.service) {
      case TRANSLATION_SERVICES.OPENAI:
        translation = await this.translateWithOpenAI(text, targetLang);
        break;
      case TRANSLATION_SERVICES.GOOGLE:
        translation = await this.translateWithGoogle(text, targetLang);
        break;
      case TRANSLATION_SERVICES.MANUAL:
        translation = await this.manualTranslate(text, targetLang);
        break;
      default:
        throw new Error(`不支持的翻译服务: ${this.service}`);
    }

    if (translation) {
      // 保存到缓存
      this.cache[cacheKey] = translation;
      this.saveCache();
    }

    return translation;
  }

  // 手动翻译模式
  async manualTranslate(text, targetLang) {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(
        `请提供 "${text}" 的${this.getLanguageName(targetLang)}翻译（回车跳过）: `,
        (answer) => {
          rl.close();
          resolve(answer.trim() || text);
        }
      );
    });
  }

  // 读取 JSON 文件
  readJsonFile(filePath) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.warn(`无法读取文件 ${filePath}:`, error.message);
      return {};
    }
  }

  // 写入 JSON 文件
  writeJsonFile(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  // 递归翻译对象
  async translateObject(obj, targetLang, keyPath = '') {
    const result = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = keyPath ? `${keyPath}.${key}` : key;
      
      // 检查是否需要排除此键
      if (this.excludeKeys.includes(currentPath)) {
        result[key] = value;
        continue;
      }

      if (typeof value === 'string') {
        // 翻译字符串
        const translation = await this.translateText(value, targetLang);
        result[key] = translation || value;
        
        // 添加延迟以避免API限制
        await new Promise(resolve => setTimeout(resolve, 100));
      } else if (typeof value === 'object' && value !== null) {
        // 递归翻译对象
        result[key] = await this.translateObject(value, targetLang, currentPath);
      } else {
        // 其他类型直接复制
        result[key] = value;
      }
    }
    
    return result;
  }

  // 检查缺失的翻译
  findMissingTranslations() {
    const sourceDir = path.join(this.localesDir, this.sourceLocale);
    const missing = {};

    if (!fs.existsSync(sourceDir)) {
      throw new Error(`源语言目录不存在: ${sourceDir}`);
    }

    const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const sourceData = this.readJsonFile(sourceFile);
      
      for (const lang of Object.keys(LANGUAGES)) {
        if (lang === this.sourceLocale) continue;
        
        const targetFile = path.join(this.localesDir, lang, file);
        const targetData = this.readJsonFile(targetFile);
        
        const missingKeys = this.findMissingKeys(sourceData, targetData);
        if (missingKeys.length > 0) {
          if (!missing[lang]) missing[lang] = {};
          missing[lang][file] = missingKeys;
        }
      }
    }

    return missing;
  }

  // 查找缺失的键
  findMissingKeys(source, target, keyPath = '') {
    const missing = [];
    
    for (const [key, value] of Object.entries(source)) {
      const currentPath = keyPath ? `${keyPath}.${key}` : key;
      
      if (!(key in target)) {
        missing.push(currentPath);
      } else if (typeof value === 'object' && value !== null && typeof target[key] === 'object') {
        missing.push(...this.findMissingKeys(value, target[key], currentPath));
      }
    }
    
    return missing;
  }

  // 执行自动翻译
  async autoTranslate(options = {}) {
    const { 
      dryRun = false, 
      specificFile = null, 
      specificLang = null,
      force = false 
    } = options;

    console.log('🌍 开始自动翻译...');
    console.log(`翻译服务: ${this.service}`);
    console.log(`源语言: ${this.sourceLocale}`);
    
    const sourceDir = path.join(this.localesDir, this.sourceLocale);
    const files = specificFile 
      ? [specificFile] 
      : fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));
    
    const targetLangs = specificLang 
      ? [specificLang] 
      : Object.keys(LANGUAGES).filter(lang => lang !== this.sourceLocale);

    for (const file of files) {
      console.log(`\n📄 处理文件: ${file}`);
      const sourceFile = path.join(sourceDir, file);
      const sourceData = this.readJsonFile(sourceFile);

      for (const targetLang of targetLangs) {
        console.log(`  🔄 翻译到 ${this.getLanguageName(targetLang)}...`);
        
        const targetFile = path.join(this.localesDir, targetLang, file);
        let targetData = {};
        
        if (!force && fs.existsSync(targetFile)) {
          targetData = this.readJsonFile(targetFile);
        }

        // 合并翻译结果
        const translatedData = await this.translateObject(sourceData, targetLang);
        const mergedData = force ? translatedData : this.mergeTranslations(targetData, translatedData);

        if (dryRun) {
          console.log(`    [DRY RUN] 将写入: ${targetFile}`);
          console.log(JSON.stringify(mergedData, null, 2));
        } else {
          this.writeJsonFile(targetFile, mergedData);
          console.log(`    ✅ 已更新: ${targetFile}`);
        }
      }
    }

    console.log('\n🎉 翻译完成！');
  }

  // 合并翻译结果
  mergeTranslations(existing, translated) {
    const result = { ...existing };
    
    for (const [key, value] of Object.entries(translated)) {
      if (typeof value === 'object' && value !== null && typeof existing[key] === 'object') {
        result[key] = this.mergeTranslations(existing[key] || {}, value);
      } else if (!(key in existing) || !existing[key]) {
        result[key] = value;
      }
    }
    
    return result;
  }

  // 生成翻译报告
  generateReport() {
    console.log('📊 生成翻译报告...\n');
    
    const missing = this.findMissingTranslations();
    
    if (Object.keys(missing).length === 0) {
      console.log('✅ 所有语言的翻译都是完整的！');
      return;
    }

    console.log('❌ 发现缺失的翻译:');
    for (const [lang, files] of Object.entries(missing)) {
      console.log(`\n🌐 ${this.getLanguageName(lang)}:`);
      for (const [file, keys] of Object.entries(files)) {
        console.log(`  📄 ${file}:`);
        keys.forEach(key => console.log(`    - ${key}`));
      }
    }
  }
}

// CLI 接口
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--service':
        options.service = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--file':
        options.specificFile = args[++i];
        break;
      case '--lang':
        options.specificLang = args[++i];
        break;
      case '--force':
        options.force = true;
        break;
      case '--report':
        options.reportOnly = true;
        break;
      case '--help':
        console.log(`
使用方法: node scripts/i18n-auto-translate.js [选项]

选项:
  --service <service>   翻译服务 (google|openai|manual)
  --dry-run            模拟运行，不实际修改文件
  --file <filename>    只处理指定文件
  --lang <langcode>    只翻译到指定语言
  --force              强制重新翻译所有内容
  --report             只生成翻译报告
  --help               显示帮助信息

示例:
  node scripts/i18n-auto-translate.js --service google
  node scripts/i18n-auto-translate.js --report
  node scripts/i18n-auto-translate.js --file common.json --lang cn
        `);
        return;
    }
  }

  const translator = new I18nAutoTranslator(options);

  if (options.reportOnly) {
    translator.generateReport();
  } else {
    await translator.autoTranslate(options);
  }
}

// 运行 CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default I18nAutoTranslator;