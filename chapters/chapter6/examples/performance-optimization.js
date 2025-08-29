const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');
const chalk = require('chalk');
const ora = require('ora');

/**
 * Performance Optimization Examples
 * Demonstrates caching, lazy loading, batch processing, and monitoring
 */
class PerformanceOptimization {
  constructor() {
    this.templates = new Map();
    this.compiledTemplates = new Map();
    this.metrics = new Map();
    this.spinner = ora();
  }

  async run() {
    console.log(chalk.blue.bold('\n🚀 Performance Optimization Examples\n'));
    
    await this.setupTemplates();
    
    console.log(chalk.yellow('\n1. Template Compilation and Caching'));
    await this.demoTemplateCaching();
    
    console.log(chalk.yellow('\n2. Lazy Loading and Code Splitting'));
    await this.demoLazyLoading();
    
    console.log(chalk.yellow('\n3. Batch Processing'));
    await this.demoBatchProcessing();
    
    console.log(chalk.yellow('\n4. Performance Monitoring'));
    await this.demoPerformanceMonitoring();
    
    console.log(chalk.green('\n✅ Performance optimization examples completed!'));
  }

  async setupTemplates() {
    this.spinner.start('Setting up templates...');
    
    // Sample templates
    this.templates.set('user-card', `
      <div class="user-card">
        <img src="{{avatar}}" alt="{{name}}" class="avatar">
        <h3>{{name}}</h3>
        <p>{{email}}</p>
        {{#if isAdmin}}
          <span class="admin-badge">Admin</span>
        {{/if}}
      </div>
    `);

    this.templates.set('product-grid', `
      <div class="product-grid">
        {{#each products}}
          <div class="product-card">
            <img src="{{image}}" alt="{{name}}">
            <h4>{{name}}</h4>
            <p class="price">${{price}}</p>
            <button onclick="addToCart('{{id}}')">Add to Cart</button>
          </div>
        {{/each}}
      </div>
    `);

    this.templates.set('email-template', `
      <div class="email">
        <h2>Hello {{name}},</h2>
        <p>{{message}}</p>
        <a href="{{actionUrl}}" class="btn">Click Here</a>
      </div>
    `);

    this.spinner.succeed('Templates setup complete');
  }

  async demoTemplateCaching() {
    console.log(chalk.cyan('\n📦 Template Caching Demo'));
    
    const cache = new TemplateCache();
    
    // First render (compilation + rendering)
    const start1 = process.hrtime.bigint();
    const result1 = await cache.render('user-card', {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar.jpg',
      isAdmin: true
    });
    const end1 = process.hrtime.bigint();
    const time1 = Number(end1 - start1) / 1000000;
    
    console.log(`First render: ${time1.toFixed(2)}ms`);
    
    // Second render (cached compilation)
    const start2 = process.hrtime.bigint();
    const result2 = await cache.render('user-card', {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'avatar2.jpg',
      isAdmin: false
    });
    const end2 = process.hrtime.bigint();
    const time2 = Number(end2 - start2) / 1000000;
    
    console.log(`Second render: ${time2.toFixed(2)}ms`);
    console.log(`Performance improvement: ${((time1 - time2) / time1 * 100).toFixed(1)}%`);
    
    console.log(chalk.gray('\nCached template result:'));
    console.log(result2.substring(0, 100) + '...');
  }

  async demoLazyLoading() {
    console.log(chalk.cyan('\n🔄 Lazy Loading Demo'));
    
    const lazyLoader = new LazyTemplateLoader();
    
    // Simulate loading different templates on demand
    const templates = ['user-card', 'product-grid', 'email-template'];
    
    for (const templateName of templates) {
      console.log(`\nLoading template: ${templateName}`);
      const template = await lazyLoader.loadTemplate(templateName);
      console.log(`Template loaded: ${template ? '✅' : '❌'}`);
    }
    
    // Show loaded templates
    console.log('\nLoaded templates:', Array.from(lazyLoader.loadedTemplates.keys()));
  }

  async demoBatchProcessing() {
    console.log(chalk.cyan('\n⚡ Batch Processing Demo'));
    
    const processor = new BatchTemplateProcessor(3); // 3 concurrent processes
    
    // Create batch of template rendering jobs
    const jobs = [
      {
        template: 'user-card',
        data: { name: 'User 1', email: 'user1@example.com', avatar: 'avatar1.jpg', isAdmin: false }
      },
      {
        template: 'user-card',
        data: { name: 'User 2', email: 'user2@example.com', avatar: 'avatar2.jpg', isAdmin: true }
      },
      {
        template: 'product-grid',
        data: { products: [
          { id: 1, name: 'Product 1', price: 29.99, image: 'product1.jpg' },
          { id: 2, name: 'Product 2', price: 49.99, image: 'product2.jpg' }
        ]}
      },
      {
        template: 'email-template',
        data: { name: 'Customer', message: 'Thank you for your order!', actionUrl: '/orders' }
      },
      {
        template: 'user-card',
        data: { name: 'User 3', email: 'user3@example.com', avatar: 'avatar3.jpg', isAdmin: false }
      }
    ];
    
    const start = process.hrtime.bigint();
    const results = await processor.processBatch(jobs);
    const end = process.hrtime.bigint();
    const totalTime = Number(end - start) / 1000000;
    
    console.log(`Processed ${jobs.length} templates in ${totalTime.toFixed(2)}ms`);
    console.log(`Average time per template: ${(totalTime / jobs.length).toFixed(2)}ms`);
    
    // Show sample results
    console.log('\nSample results:');
    results.slice(0, 2).forEach((result, index) => {
      console.log(`${index + 1}. ${result.substring(0, 50)}...`);
    });
  }

  async demoPerformanceMonitoring() {
    console.log(chalk.cyan('\n📊 Performance Monitoring Demo'));
    
    const monitor = new TemplatePerformanceMonitor();
    const cache = new TemplateCache();
    
    // Simulate multiple template renders with monitoring
    const templates = ['user-card', 'product-grid', 'email-template'];
    const iterations = 10;
    
    for (let i = 0; i < iterations; i++) {
      for (const templateName of templates) {
        const timer = monitor.startTimer(templateName);
        
        await cache.render(templateName, {
          name: `User ${i}`,
          email: `user${i}@example.com`,
          avatar: `avatar${i}.jpg`,
          isAdmin: i % 2 === 0,
          products: [
            { id: i, name: `Product ${i}`, price: 29.99 + i, image: `product${i}.jpg` }
          ],
          message: `Message ${i}`,
          actionUrl: `/action/${i}`
        });
        
        monitor.endTimer(timer);
      }
    }
    
    // Display performance metrics
    console.log('\nPerformance Metrics:');
    for (const templateName of templates) {
      const metrics = monitor.getMetrics(templateName);
      if (metrics) {
        console.log(`\n${templateName}:`);
        console.log(`  Count: ${metrics.count}`);
        console.log(`  Average: ${metrics.average.toFixed(2)}ms`);
        console.log(`  Min: ${metrics.min.toFixed(2)}ms`);
        console.log(`  Max: ${metrics.max.toFixed(2)}ms`);
        console.log(`  P95: ${metrics.p95.toFixed(2)}ms`);
      }
    }
  }
}

/**
 * Template Cache with compilation optimization
 */
class TemplateCache {
  constructor() {
    this.compiledTemplates = new Map();
  }

  async getTemplate(name) {
    if (this.compiledTemplates.has(name)) {
      return this.compiledTemplates.get(name);
    }

    // Simulate template loading
    const template = await this.loadTemplate(name);
    const compiled = Handlebars.compile(template);
    this.compiledTemplates.set(name, compiled);
    return compiled;
  }

  async loadTemplate(name) {
    // In real implementation, this would load from file system
    const templates = {
      'user-card': `
        <div class="user-card">
          <img src="{{avatar}}" alt="{{name}}" class="avatar">
          <h3>{{name}}</h3>
          <p>{{email}}</p>
          {{#if isAdmin}}
            <span class="admin-badge">Admin</span>
          {{/if}}
        </div>
      `,
      'product-grid': `
        <div class="product-grid">
          {{#each products}}
            <div class="product-card">
              <img src="{{image}}" alt="{{name}}">
              <h4>{{name}}</h4>
              <p class="price">${{price}}</p>
              <button onclick="addToCart('{{id}}')">Add to Cart</button>
            </div>
          {{/each}}
        </div>
      `,
      'email-template': `
        <div class="email">
          <h2>Hello {{name}},</h2>
          <p>{{message}}</p>
          <a href="{{actionUrl}}" class="btn">Click Here</a>
        </div>
      `
    };

    return templates[name] || '';
  }

  async render(name, data) {
    const template = await this.getTemplate(name);
    return template(data);
  }
}

/**
 * Lazy Template Loader
 */
class LazyTemplateLoader {
  constructor() {
    this.loadedTemplates = new Map();
  }

  async loadTemplate(templateName) {
    if (this.loadedTemplates.has(templateName)) {
      return this.loadedTemplates.get(templateName);
    }

    // Simulate async template loading
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const template = await this.fetchTemplate(templateName);
    this.loadedTemplates.set(templateName, template);
    
    return template;
  }

  async fetchTemplate(templateName) {
    // Simulate fetching template from remote source
    const templates = {
      'user-card': 'User card template content',
      'product-grid': 'Product grid template content',
      'email-template': 'Email template content'
    };
    
    return templates[templateName] || null;
  }
}

/**
 * Batch Template Processor
 */
class BatchTemplateProcessor {
  constructor(concurrency = 5) {
    this.concurrency = concurrency;
  }

  async processBatch(jobs) {
    const results = [];
    
    for (let i = 0; i < jobs.length; i += this.concurrency) {
      const batch = jobs.slice(i, i + this.concurrency);
      const batchResults = await Promise.all(
        batch.map(job => this.processTemplate(job))
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  async processTemplate(job) {
    const cache = new TemplateCache();
    return await cache.render(job.template, job.data);
  }
}

/**
 * Template Performance Monitor
 */
class TemplatePerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(templateName) {
    return {
      templateName,
      startTime: process.hrtime.bigint()
    };
  }

  endTimer(timer) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - timer.startTime) / 1000000;

    if (!this.metrics.has(timer.templateName)) {
      this.metrics.set(timer.templateName, []);
    }

    this.metrics.get(timer.templateName).push(duration);

    // Keep only last 100 measurements
    const measurements = this.metrics.get(timer.templateName);
    if (measurements.length > 100) {
      measurements.shift();
    }

    return duration;
  }

  getMetrics(templateName) {
    const measurements = this.metrics.get(templateName) || [];
    
    if (measurements.length === 0) {
      return null;
    }

    const sorted = measurements.sort((a, b) => a - b);
    const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;

    return {
      count: measurements.length,
      average: avg,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new PerformanceOptimization();
  demo.run().catch(console.error);
}

module.exports = {
  PerformanceOptimization,
  TemplateCache,
  LazyTemplateLoader,
  BatchTemplateProcessor,
  TemplatePerformanceMonitor
};
