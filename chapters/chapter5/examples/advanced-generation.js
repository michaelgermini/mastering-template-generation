#!/usr/bin/env node

/**
 * Advanced Generation Example
 * Demonstrates AST-based transformation and schema-driven generation
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

class AdvancedGeneration {
  constructor() {
    this.outputDir = './advanced-generation';
    this.spinner = null;
  }

  async run() {
    console.log(chalk.blue.bold('\n🚀 Advanced Generation Demo\n'));
    
    try {
      await this.demoASTTransformation();
      await this.demoSchemaGeneration();
      
      console.log(chalk.green.bold('\n✅ Advanced generation demo completed successfully!'));
      console.log(chalk.yellow(`📁 Generated files: ${this.outputDir}`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during advanced generation demo:'), error.message);
    }
  }

  async demoASTTransformation() {
    console.log(chalk.cyan.bold('\n🌳 AST-Based Transformation Demo'));
    
    this.spinner = ora('Generating AST transformation examples...').start();
    
    const astDir = path.join(this.outputDir, 'ast-transformation');
    await fs.ensureDir(astDir);
    
    const files = {
      'ast-transformer.js': this.generateASTTransformer(),
      'code-analyzer.js': this.generateCodeAnalyzer()
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(astDir, filename), content);
    }
    
    this.spinner.succeed('AST transformation examples generated');
  }

  async demoSchemaGeneration() {
    console.log(chalk.cyan.bold('\n📋 Schema-Driven Generation Demo'));
    
    this.spinner = ora('Generating schema-driven examples...').start();
    
    const schemaDir = path.join(this.outputDir, 'schema-generation');
    await fs.ensureDir(schemaDir);
    
    const files = {
      'schema-generator.js': this.generateSchemaGenerator(),
      'example-schema.json': this.generateExampleSchema()
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(schemaDir, filename), content);
    }
    
    this.spinner.succeed('Schema-driven examples generated');
  }

  generateASTTransformer() {
    return `/**
 * AST Transformer Example
 */

class ASTTransformer {
  transform(code, transformations = []) {
    let result = code;
    
    for (const transformation of transformations) {
      result = this.applyTransformation(result, transformation);
    }
    
    return result;
  }

  applyTransformation(code, type) {
    switch (type) {
      case 'add-imports':
        return this.addImports(code, ['React', 'useState']);
      case 'add-comments':
        return this.addComments(code);
      case 'modify-functions':
        return this.modifyFunctions(code);
      default:
        return code;
    }
  }

  addImports(code, imports) {
    const importStatements = imports.map(imp => \`import { \${imp} } from './\${imp.toLowerCase()}';\`).join('\\n');
    return \`\${importStatements}\\n\\n\${code}\`;
  }

  addComments(code) {
    return code.replace(/(function|class|const|let|var)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, 
      '// TODO: Document this $1\\n$1 $2');
  }

  modifyFunctions(code) {
    return code.replace(/function\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\(([^)]*)\\)/g,
      'function $1($2) {\\n  // Generated function\\n  return null;\\n}');
  }
}

module.exports = ASTTransformer;`;
  }

  generateCodeAnalyzer() {
    return `/**
 * Code Analyzer Example
 */

class CodeAnalyzer {
  analyze(code) {
    return {
      lines: code.split('\\n').length,
      functions: this.countFunctions(code),
      classes: this.countClasses(code),
      imports: this.countImports(code)
    };
  }

  countFunctions(code) {
    const functionRegex = /function\\s+[a-zA-Z_$][a-zA-Z0-9_$]*\\s*\\(/g;
    return (code.match(functionRegex) || []).length;
  }

  countClasses(code) {
    const classRegex = /class\\s+[a-zA-Z_$][a-zA-Z0-9_$]*/g;
    return (code.match(classRegex) || []).length;
  }

  countImports(code) {
    const importRegex = /import\\s+.*from\\s+['"][^'"]+['"]/g;
    return (code.match(importRegex) || []).length;
  }
}

module.exports = CodeAnalyzer;`;
  }

  generateSchemaGenerator() {
    return `/**
 * Schema Generator Example
 */

class SchemaGenerator {
  generateFromSchema(schema, language = 'typescript') {
    switch (language) {
      case 'typescript':
        return this.generateTypeScript(schema);
      case 'java':
        return this.generateJava(schema);
      default:
        return this.generateTypeScript(schema);
    }
  }

  generateTypeScript(schema) {
    const properties = Object.entries(schema.properties)
      .map(([name, type]) => \`  \${name}: \${this.mapType(type)};\`)
      .join('\\n');

    return \`export interface \${schema.name} {
\${properties}
}\`;
  }

  generateJava(schema) {
    const properties = Object.entries(schema.properties)
      .map(([name, type]) => \`  private \${this.mapJavaType(type)} \${name};\`)
      .join('\\n');

    return \`public class \${schema.name} {
\${properties}
  
  public \${schema.name}() {}
}\`;
  }

  mapType(type) {
    const typeMap = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      array: 'any[]',
      object: 'any'
    };
    return typeMap[type] || 'any';
  }

  mapJavaType(type) {
    const typeMap = {
      string: 'String',
      number: 'int',
      boolean: 'boolean',
      array: 'List<Object>',
      object: 'Object'
    };
    return typeMap[type] || 'Object';
  }
}

module.exports = SchemaGenerator;`;
  }

  generateExampleSchema() {
    return JSON.stringify({
      name: "User",
      properties: {
        id: "number",
        name: "string",
        email: "string",
        isActive: "boolean"
      }
    }, null, 2);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new AdvancedGeneration();
  demo.run().catch(console.error);
}

module.exports = AdvancedGeneration;
