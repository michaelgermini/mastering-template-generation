# Chapter 6: Best Practices

## Overview

This chapter covers essential best practices for template development, from design principles to deployment strategies. You'll learn how to create maintainable, secure, and performant templates that scale with your applications.

## Learning Objectives

- Understand template design principles and patterns
- Implement performance optimization strategies
- Apply security best practices to prevent vulnerabilities
- Create maintainable and testable template code
- Develop effective testing strategies for templates
- Plan for production deployment and monitoring

## Table of Contents

1. [Template Design Principles](#template-design-principles)
2. [Performance Optimization](#performance-optimization)
3. [Security Best Practices](#security-best-practices)
4. [Maintainability and Code Quality](#maintainability-and-code-quality)
5. [Testing Strategies](#testing-strategies)
6. [Deployment and Monitoring](#deployment-and-monitoring)
7. [Case Study: Enterprise Template System](#case-study-enterprise-template-system)

## Template Design Principles

### Separation of Concerns

Templates should focus solely on presentation logic, keeping business logic separate.

```javascript
// ❌ Bad: Business logic in template
{{#each users}}
  {{#if (eq status "active")}}
    <div class="user active">{{name}}</div>
  {{else}}
    <div class="user inactive">{{name}}</div>
  {{/if}}
{{/each}}

// ✅ Good: Data prepared in controller
{{#each activeUsers}}
  <div class="user active">{{name}}</div>
{{/each}}
{{#each inactiveUsers}}
  <div class="user inactive">{{name}}</div>
{{/each}}
```

### DRY (Don't Repeat Yourself)

Use template inheritance, partials, and macros to avoid code duplication.

```handlebars
{{!-- Base layout --}}
<!DOCTYPE html>
<html>
<head>
  {{> head}}
</head>
<body>
  {{> header}}
  <main>{{{body}}}</main>
  {{> footer}}
</body>
</html>

{{!-- Page template --}}
{{#> layout}}
  <h1>{{title}}</h1>
  {{> content}}
{{/layout}}
```

### Progressive Enhancement

Design templates to work without JavaScript, then enhance with client-side features.

```html
<!-- Base functionality works without JS -->
<form action="/submit" method="POST">
  <input type="email" name="email" required>
  <button type="submit">Submit</button>
</form>

<!-- Enhanced with JavaScript -->
<script>
  document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // AJAX submission with enhanced UX
  });
</script>
```

## Performance Optimization

### Template Compilation and Caching

Pre-compile templates and cache them for better performance.

```javascript
// Template compilation with caching
class TemplateCache {
  constructor() {
    this.cache = new Map();
    this.compiledTemplates = new Map();
  }

  async getTemplate(name) {
    if (this.compiledTemplates.has(name)) {
      return this.compiledTemplates.get(name);
    }

    const template = await this.loadTemplate(name);
    const compiled = Handlebars.compile(template);
    this.compiledTemplates.set(name, compiled);
    return compiled;
  }

  async render(name, data) {
    const template = await this.getTemplate(name);
    return template(data);
  }
}
```

### Lazy Loading and Code Splitting

Load templates only when needed to reduce initial bundle size.

```javascript
// Lazy loading templates
const loadTemplate = async (templateName) => {
  const module = await import(`./templates/${templateName}.js`);
  return module.default;
};

// Usage in React-like component
class LazyTemplate extends Component {
  state = { template: null };

  async componentDidMount() {
    const template = await loadTemplate(this.props.templateName);
    this.setState({ template });
  }

  render() {
    if (!this.state.template) return <div>Loading...</div>;
    return this.state.template(this.props.data);
  }
}
```

### Batch Processing

Process multiple templates efficiently in batches.

```javascript
class BatchTemplateProcessor {
  constructor(concurrency = 5) {
    this.concurrency = concurrency;
    this.queue = [];
    this.running = 0;
  }

  async processBatch(templates) {
    const results = [];
    
    for (let i = 0; i < templates.length; i += this.concurrency) {
      const batch = templates.slice(i, i + this.concurrency);
      const batchResults = await Promise.all(
        batch.map(template => this.processTemplate(template))
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  async processTemplate(template) {
    // Template processing logic
    return await template.render();
  }
}
```

## Security Best Practices

### Input Validation and Sanitization

Always validate and sanitize data before rendering in templates.

```javascript
class SecureTemplateEngine {
  constructor() {
    this.validators = new Map();
    this.sanitizers = new Map();
  }

  validate(data, schema) {
    for (const [key, validator] of Object.entries(schema)) {
      if (!validator(data[key])) {
        throw new Error(`Invalid data for field: ${key}`);
      }
    }
    return true;
  }

  sanitize(data) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = this.sanitizeValue(value);
    }
    return sanitized;
  }

  sanitizeValue(value) {
    if (typeof value === 'string') {
      return DOMPurify.sanitize(value);
    }
    return value;
  }

  render(template, data) {
    const sanitizedData = this.sanitize(data);
    return template(sanitizedData);
  }
}
```

### Content Security Policy (CSP)

Implement CSP headers to prevent XSS attacks.

```javascript
// Express.js middleware for CSP
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'"
  ].join('; '));
  next();
});
```

### Template Injection Prevention

Prevent template injection by controlling template sources and context.

```javascript
class SecureTemplateManager {
  constructor() {
    this.allowedTemplates = new Set();
    this.templateContext = {};
  }

  registerTemplate(name, template) {
    // Validate template source
    if (this.isValidTemplate(template)) {
      this.allowedTemplates.add(name);
      this.templateContext[name] = template;
    }
  }

  isValidTemplate(template) {
    // Check for dangerous patterns
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /require\s*\(/,
      /process\./
    ];

    return !dangerousPatterns.some(pattern => pattern.test(template));
  }

  render(templateName, data) {
    if (!this.allowedTemplates.has(templateName)) {
      throw new Error(`Template not allowed: ${templateName}`);
    }

    const template = this.templateContext[templateName];
    return template(data);
  }
}
```

## Maintainability and Code Quality

### Template Organization

Organize templates in a logical structure for better maintainability.

```
templates/
├── layouts/
│   ├── base.html
│   ├── admin.html
│   └── mobile.html
├── partials/
│   ├── header.html
│   ├── footer.html
│   └── navigation.html
├── pages/
│   ├── home.html
│   ├── about.html
│   └── contact.html
├── components/
│   ├── user-card.html
│   ├── product-grid.html
│   └── search-form.html
└── emails/
    ├── welcome.html
    ├── notification.html
    └── newsletter.html
```

### Documentation and Comments

Document templates with clear comments and examples.

```handlebars
{{!-- 
  User Profile Card Component
  
  Usage:
  {{> user-card user=userData showActions=true }}
  
  Parameters:
  - user: Object containing user data (name, email, avatar, etc.)
  - showActions: Boolean to show/hide action buttons
  
  Example:
  {{> user-card user=currentUser showActions=true }}
--}}

<div class="user-card {{#if showActions}}with-actions{{/if}}">
  <img src="{{user.avatar}}" alt="{{user.name}}" class="avatar">
  <h3>{{user.name}}</h3>
  <p>{{user.email}}</p>
  
  {{#if showActions}}
    <div class="actions">
      <button onclick="editUser('{{user.id}}')">Edit</button>
      <button onclick="deleteUser('{{user.id}}')">Delete</button>
    </div>
  {{/if}}
</div>
```

### Version Control and Change Management

Implement proper version control for templates.

```javascript
class TemplateVersionControl {
  constructor() {
    this.versions = new Map();
    this.currentVersion = '1.0.0';
  }

  registerTemplate(name, template, version) {
    if (!this.versions.has(name)) {
      this.versions.set(name, new Map());
    }
    
    this.versions.get(name).set(version, template);
  }

  getTemplate(name, version = this.currentVersion) {
    const templateVersions = this.versions.get(name);
    if (!templateVersions) {
      throw new Error(`Template not found: ${name}`);
    }

    const template = templateVersions.get(version);
    if (!template) {
      throw new Error(`Version not found: ${name}@${version}`);
    }

    return template;
  }

  listVersions(name) {
    const templateVersions = this.versions.get(name);
    return templateVersions ? Array.from(templateVersions.keys()) : [];
  }
}
```

## Testing Strategies

### Unit Testing Templates

Test individual templates in isolation.

```javascript
// Jest test for Handlebars template
describe('User Card Template', () => {
  let template;

  beforeEach(() => {
    template = Handlebars.compile(`
      <div class="user-card">
        <h3>{{name}}</h3>
        <p>{{email}}</p>
        {{#if isAdmin}}
          <span class="admin-badge">Admin</span>
        {{/if}}
      </div>
    `);
  });

  test('renders user information correctly', () => {
    const data = {
      name: 'John Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    const result = template(data);
    
    expect(result).toContain('John Doe');
    expect(result).toContain('john@example.com');
    expect(result).not.toContain('admin-badge');
  });

  test('shows admin badge for admin users', () => {
    const data = {
      name: 'Admin User',
      email: 'admin@example.com',
      isAdmin: true
    };

    const result = template(data);
    
    expect(result).toContain('admin-badge');
  });
});
```

### Integration Testing

Test template integration with data sources and rendering engines.

```javascript
class TemplateIntegrationTest {
  constructor(templateEngine, dataSource) {
    this.templateEngine = templateEngine;
    this.dataSource = dataSource;
  }

  async testTemplateRendering(templateName, testData) {
    // Test data preparation
    const data = await this.dataSource.getData(testData);
    
    // Test template rendering
    const result = await this.templateEngine.render(templateName, data);
    
    // Validate output
    return this.validateOutput(result, testData.expected);
  }

  validateOutput(result, expected) {
    const validation = {
      success: true,
      errors: []
    };

    // Check for required elements
    for (const element of expected.requiredElements) {
      if (!result.includes(element)) {
        validation.success = false;
        validation.errors.push(`Missing required element: ${element}`);
      }
    }

    // Check for forbidden elements
    for (const element of expected.forbiddenElements || []) {
      if (result.includes(element)) {
        validation.success = false;
        validation.errors.push(`Forbidden element found: ${element}`);
      }
    }

    return validation;
  }
}
```

### Visual Regression Testing

Test for visual changes in template rendering.

```javascript
class VisualRegressionTest {
  constructor(browser) {
    this.browser = browser;
  }

  async captureTemplateScreenshot(templateName, data, options = {}) {
    const page = await this.browser.newPage();
    
    // Set viewport
    await page.setViewport({
      width: options.width || 1920,
      height: options.height || 1080
    });

    // Render template
    const html = await this.renderTemplate(templateName, data);
    await page.setContent(html);

    // Capture screenshot
    const screenshot = await page.screenshot({
      fullPage: options.fullPage || false
    });

    await page.close();
    return screenshot;
  }

  async compareScreenshots(baseline, current) {
    const diff = await this.calculateImageDiff(baseline, current);
    return {
      isDifferent: diff.percentage > 0.1, // 0.1% threshold
      difference: diff.percentage,
      diffImage: diff.image
    };
  }
}
```

## Deployment and Monitoring

### Environment-Specific Configuration

Configure templates for different environments.

```javascript
class EnvironmentConfig {
  constructor(environment) {
    this.environment = environment;
    this.config = this.loadConfig();
  }

  loadConfig() {
    const configs = {
      development: {
        debug: true,
        cache: false,
        minify: false,
        cdn: false
      },
      staging: {
        debug: false,
        cache: true,
        minify: true,
        cdn: false
      },
      production: {
        debug: false,
        cache: true,
        minify: true,
        cdn: true
      }
    };

    return configs[this.environment] || configs.development;
  }

  getTemplateConfig() {
    return {
      enableCache: this.config.cache,
      enableMinification: this.config.minify,
      enableDebug: this.config.debug,
      cdnUrl: this.config.cdn ? process.env.CDN_URL : null
    };
  }
}
```

### Performance Monitoring

Monitor template rendering performance in production.

```javascript
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
    const duration = Number(endTime - timer.startTime) / 1000000; // Convert to milliseconds

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
```

### Error Handling and Logging

Implement comprehensive error handling for template rendering.

```javascript
class TemplateErrorHandler {
  constructor(logger) {
    this.logger = logger;
    this.errorCounts = new Map();
  }

  handleError(error, context) {
    const errorKey = `${error.name}:${context.templateName}`;
    
    // Increment error count
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);

    // Log error with context
    this.logger.error('Template rendering error', {
      error: error.message,
      stack: error.stack,
      template: context.templateName,
      data: context.data,
      timestamp: new Date().toISOString()
    });

    // Return fallback template
    return this.getFallbackTemplate(context);
  }

  getFallbackTemplate(context) {
    return `
      <div class="error-template">
        <h2>Something went wrong</h2>
        <p>We're sorry, but there was an error rendering this content.</p>
        ${process.env.NODE_ENV === 'development' ? 
          `<pre>${context.error?.message || 'Unknown error'}</pre>` : 
          ''
        }
      </div>
    `;
  }

  getErrorStats() {
    const stats = {};
    for (const [errorKey, count] of this.errorCounts) {
      stats[errorKey] = count;
    }
    return stats;
  }
}
```

## Case Study: Enterprise Template System

### System Architecture

A large e-commerce platform implements a comprehensive template system:

```javascript
class EnterpriseTemplateSystem {
  constructor() {
    this.cache = new TemplateCache();
    this.security = new SecureTemplateEngine();
    this.monitor = new TemplatePerformanceMonitor();
    this.errorHandler = new TemplateErrorHandler(new Logger());
    this.versionControl = new TemplateVersionControl();
  }

  async renderTemplate(templateName, data, options = {}) {
    const timer = this.monitor.startTimer(templateName);
    
    try {
      // Validate and sanitize data
      const sanitizedData = this.security.sanitize(data);
      
      // Get template with version control
      const template = this.versionControl.getTemplate(
        templateName, 
        options.version
      );
      
      // Render template
      const result = await template.render(sanitizedData);
      
      // Record performance
      this.monitor.endTimer(timer);
      
      return result;
    } catch (error) {
      // Handle errors
      return this.errorHandler.handleError(error, {
        templateName,
        data,
        error
      });
    }
  }

  async batchRender(templates) {
    const processor = new BatchTemplateProcessor(10);
    return await processor.processBatch(templates);
  }

  getSystemHealth() {
    return {
      cache: this.cache.getStats(),
      performance: this.monitor.getMetrics(),
      errors: this.errorHandler.getErrorStats(),
      versions: Array.from(this.versionControl.versions.keys())
    };
  }
}
```

### Implementation Results

The enterprise system achieved:

- **Performance**: 50% reduction in template rendering time
- **Security**: Zero template injection vulnerabilities
- **Maintainability**: 80% reduction in template-related bugs
- **Scalability**: Support for 10,000+ concurrent template renders

## Summary

This chapter covered essential best practices for template development:

1. **Design Principles**: Separation of concerns, DRY, progressive enhancement
2. **Performance**: Compilation, caching, lazy loading, batch processing
3. **Security**: Input validation, CSP, template injection prevention
4. **Maintainability**: Organization, documentation, version control
5. **Testing**: Unit, integration, and visual regression testing
6. **Deployment**: Environment configuration, monitoring, error handling

These practices ensure your templates are secure, performant, and maintainable in production environments.

## Next Steps

In the next chapter, we'll explore AI and Generative Templates, covering machine learning integration, automated template generation, and intelligent content adaptation.
