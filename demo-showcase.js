#!/usr/bin/env node

/**
 * Demo Showcase - Key Functionality Examples
 * Demonstrates the core concepts from the book
 */

const chalk = require('chalk');
const Handlebars = require('handlebars');

console.log(chalk.blue.bold('\n🎯 Mastering Template Generation - Demo Showcase\n'));

// 1. Basic Template Engine Demo
console.log(chalk.green.bold('1. Basic Template Engine Demo'));
console.log(chalk.gray('====================================='));

class SimpleTemplateEngine {
  constructor() {
    this.delimiters = { start: '{{', end: '}}' };
  }

  render(template, data) {
    let result = template;
    result = result.replace(
      new RegExp(`${this.escapeRegex(this.delimiters.start)}(\\w+)${this.escapeRegex(this.delimiters.end)}`, 'g'),
      (match, key) => data[key] !== undefined ? data[key] : match
    );
    return result;
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

const engine = new SimpleTemplateEngine();
const template = "Hello {{name}}! Your order #{{orderId}} for ${{amount}} is {{status}}.";
const data = { name: "Alice", orderId: "12345", amount: "299.99", status: "confirmed" };

console.log('Template:', template);
console.log('Data:', JSON.stringify(data, null, 2));
console.log('Output:', engine.render(template, data));
console.log();

// 2. Handlebars Demo
console.log(chalk.green.bold('2. Handlebars Template Engine Demo'));
console.log(chalk.gray('========================================='));

// Register a custom helper
Handlebars.registerHelper('formatPrice', function(price) {
  return `$${parseFloat(price).toFixed(2)}`;
});

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

const handlebarsTemplate = `
Product Catalog
===============
{{#each products}}
  {{#ifEquals category "Electronics"}}
    ⚡ {{name}} - {{formatPrice price}}
  {{else}}
    📦 {{name}} - {{formatPrice price}}
  {{/ifEquals}}
{{/each}}

Total Items: {{products.length}}
`;

const productsData = {
  products: [
    { name: "Laptop", price: 1299.99, category: "Electronics" },
    { name: "Mouse", price: 49.99, category: "Electronics" },
    { name: "Desk", price: 199.99, category: "Furniture" }
  ]
};

const templateFn = Handlebars.compile(handlebarsTemplate);
console.log('Template:', handlebarsTemplate);
console.log('Data:', JSON.stringify(productsData, null, 2));
console.log('Output:', templateFn(productsData));
console.log();

// 3. Template Inheritance Demo
console.log(chalk.green.bold('3. Template Inheritance Demo'));
console.log(chalk.gray('================================='));

// Base layout template
const baseLayout = `
<!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
    <meta charset="utf-8">
    {{#if styles}}
    <style>{{styles}}</style>
    {{/if}}
</head>
<body>
    <header>
        <h1>{{siteName}}</h1>
        <nav>{{navigation}}</nav>
    </header>
    
    <main>
        {{content}}
    </main>
    
    <footer>
        <p>&copy; 2025 {{siteName}}. All rights reserved.</p>
    </footer>
</body>
</html>
`;

// Page-specific template
const pageTemplate = `
{{#extend "layout"}}
    {{#content "title"}}User Profile{{/content}}
    {{#content "styles"}}
        .profile { padding: 20px; }
        .avatar { border-radius: 50%; }
    {{/content}}
    {{#content "content"}}
        <div class="profile">
            <img src="{{avatar}}" alt="{{name}}" class="avatar">
            <h2>{{name}}</h2>
            <p>Email: {{email}}</p>
            <p>Role: {{role}}</p>
        </div>
    {{/content}}
{{/extend}}
`;

// Simple template inheritance implementation
class TemplateInheritance {
  constructor() {
    this.templates = {};
  }

  register(name, template) {
    this.templates[name] = template;
  }

  render(templateName, data) {
    const template = this.templates[templateName];
    if (!template) throw new Error(`Template '${templateName}' not found`);
    
    // Simple implementation - in real engines this would be more complex
    return this.processTemplate(template, data);
  }

  processTemplate(template, data) {
    let result = template;
    
    // Replace variables
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });

    // Simple conditional
    result = result.replace(/\{\{#if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
      return data[condition] ? content : '';
    });

    return result;
  }
}

const inheritance = new TemplateInheritance();
inheritance.register('layout', baseLayout);

const userData = {
  siteName: "MyApp",
  navigation: "Home | Profile | Settings",
  title: "User Profile",
  styles: ".profile { padding: 20px; } .avatar { border-radius: 50%; }",
  content: `
    <div class="profile">
      <img src="https://via.placeholder.com/100" alt="John Doe" class="avatar">
      <h2>John Doe</h2>
      <p>Email: john@example.com</p>
      <p>Role: Developer</p>
    </div>
  `,
  avatar: "https://via.placeholder.com/100",
  name: "John Doe",
  email: "john@example.com",
  role: "Developer"
};

console.log('Layout Template:', baseLayout.substring(0, 200) + '...');
console.log('User Data:', JSON.stringify(userData, null, 2));
console.log('Rendered Output:', inheritance.render('layout', userData).substring(0, 300) + '...');
console.log();

// 4. Code Generation Demo
console.log(chalk.green.bold('4. Code Generation Demo'));
console.log(chalk.gray('============================'));

class CodeGenerator {
  constructor() {
    this.templates = {
      reactComponent: `
import React from 'react';

const {{componentName}} = ({ {{props}} }) => {
  return (
    <div className="{{componentName.toLowerCase}}-container">
      <h2>{{componentName}}</h2>
      {{#each props}}
      <p>{{this}}: {{this}}</p>
      {{/each}}
    </div>
  );
};

export default {{componentName}};
`,
      apiController: `
const express = require('express');
const router = express.Router();

// GET {{endpoint}}
router.get('{{endpoint}}', async (req, res) => {
  try {
    // TODO: Implement {{action}} logic
    res.json({ message: '{{action}} successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
`
    };
  }

  generateReactComponent(name, props) {
    const template = this.templates.reactComponent;
    const data = {
      componentName: name,
      props: props.join(', ')
    };
    
    return this.renderTemplate(template, data);
  }

  generateAPIController(endpoint, action) {
    const template = this.templates.apiController;
    const data = { endpoint, action };
    
    return this.renderTemplate(template, data);
  }

  renderTemplate(template, data) {
    let result = template;
    
    // Replace variables
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });

    // Handle loops
    result = result.replace(/\{\{#each\s+(\w+)\}\}(.*?)\{\{\/each\}\}/gs, (match, arrayKey, content) => {
      if (Array.isArray(data[arrayKey])) {
        return data[arrayKey].map(item => {
          let itemContent = content;
          itemContent = itemContent.replace(/\{\{this\}\}/g, item);
          return itemContent;
        }).join('\n');
      }
      return '';
    });

    return result;
  }
}

const codeGen = new CodeGenerator();

console.log('Generated React Component:');
console.log(codeGen.generateReactComponent('UserCard', ['name', 'email', 'avatar']));
console.log();

console.log('Generated API Controller:');
console.log(codeGen.generateAPIController('/api/users', 'get users'));
console.log();

// 5. Performance Demo
console.log(chalk.green.bold('5. Performance Optimization Demo'));
console.log(chalk.gray('====================================='));

class TemplateCache {
  constructor() {
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0 };
  }

  get(key) {
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    }
    this.stats.misses++;
    return null;
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;
    return { ...this.stats, total, hitRate: `${hitRate}%` };
  }
}

const cache = new TemplateCache();

// Simulate template compilation and caching
const templates = [
  'Hello {{name}}!',
  'Welcome to {{company}}, {{name}}!',
  'Your order #{{orderId}} is {{status}}.'
];

console.log('Template Compilation and Caching:');
templates.forEach((template, index) => {
  const key = `template_${index}`;
  
  // First access - compile and cache
  let compiled = cache.get(key);
  if (!compiled) {
    compiled = Handlebars.compile(template);
    cache.set(key, compiled);
    console.log(`  Template ${index}: Compiled and cached`);
  } else {
    console.log(`  Template ${index}: Retrieved from cache`);
  }
  
  // Second access - should be cached
  const cached = cache.get(key);
  if (cached) {
    console.log(`  Template ${index}: Retrieved from cache (2nd access)`);
  }
});

console.log('\nCache Statistics:', cache.getStats());
console.log();

// 6. Summary
console.log(chalk.blue.bold('🎉 Demo Summary'));
console.log(chalk.gray('==============='));
console.log('✅ Basic template engine with variable replacement');
console.log('✅ Handlebars with custom helpers and conditionals');
console.log('✅ Template inheritance concepts');
console.log('✅ Code generation with templates');
console.log('✅ Performance optimization with caching');
console.log('\n📚 This demonstrates the core concepts covered in the book!');
console.log('📖 Each chapter builds upon these fundamentals with real-world examples.');
console.log('🚀 Ready to explore advanced automation and AI-powered templates!');
