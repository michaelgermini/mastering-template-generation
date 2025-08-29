# Template Generation Quick Reference

## 🚀 Template Fundamentals

### Basic Syntax Patterns
```javascript
// Mustache-style
{{variable}}

// ERB-style  
<%= variable %>

// Jinja-style
{{ variable }}

// PHP-style
<?php echo $variable; ?>
```

### Template Engine Comparison

| Engine | Language | Strengths | Use Cases |
|--------|----------|-----------|-----------|
| **Handlebars** | JavaScript | Simple, safe, helpers | Web apps, emails |
| **EJS** | JavaScript | Full JS power | Server-side rendering |
| **Jinja2** | Python | Powerful, flexible | Web frameworks, docs |
| **Twig** | PHP | Symfony integration | PHP applications |
| **Mustache** | Multi | Logic-less, portable | Cross-platform |

## 📚 Template Types

### 1. String Templates
```javascript
const template = "Hello {{name}}!";
const data = { name: "World" };
// Output: "Hello World!"
```

### 2. HTML Templates
```html
<div class="user-card">
  <h2>{{user.name}}</h2>
  <p>{{user.email}}</p>
  {{#if user.isAdmin}}
    <span class="admin-badge">Admin</span>
  {{/if}}
</div>
```

### 3. Code Templates
```javascript
// React Component Template
const {{componentName}} = ({ {{props}} }) => {
  return (
    <div className="{{className}}">
      {{content}}
    </div>
  );
};
```

### 4. Document Templates
```html
<!-- Email Template -->
<html>
  <body>
    <h1>{{subject}}</h1>
    <p>{{greeting}}, {{recipientName}}!</p>
    <p>{{message}}</p>
    <footer>{{signature}}</footer>
  </body>
</html>
```

## 🔧 Popular Template Engines

### JavaScript/Node.js
```javascript
// Handlebars
const Handlebars = require('handlebars');
const template = Handlebars.compile('Hello {{name}}!');
template({ name: 'World' });

// EJS
const ejs = require('ejs');
ejs.render('<%= name %>', { name: 'World' });

// Mustache
const Mustache = require('mustache');
Mustache.render('Hello {{name}}!', { name: 'World' });
```

### Python
```python
# Jinja2
from jinja2 import Template
template = Template('Hello {{ name }}!')
template.render(name='World')

# Mako
from mako.template import Template
template = Template('Hello ${name}!')
template.render(name='World')
```

### PHP
```php
// Twig
$loader = new Twig_Loader_String();
$twig = new Twig_Environment($loader);
$template = $twig->loadTemplate('Hello {{ name }}!');
$template->render(array('name' => 'World'));
```

## 🎯 Advanced Features

### Template Inheritance
```html
<!-- Base Layout -->
<!DOCTYPE html>
<html>
<head><title>{{title}}</title></head>
<body>
  <header>{{header}}</header>
  <main>{{content}}</main>
  <footer>{{footer}}</footer>
</body>
</html>

<!-- Child Template -->
{{#extend "layout"}}
  {{#content "title"}}My Page{{/content}}
  {{#content "content"}}Page content here{{/content}}
{{/extend}}
```

### Custom Helpers
```javascript
// Handlebars Helper
Handlebars.registerHelper('formatPrice', function(price) {
  return `$${parseFloat(price).toFixed(2)}`;
});

// Usage
{{formatPrice product.price}}
```

### Partials/Includes
```html
<!-- Header Partial -->
<header class="site-header">
  <nav>{{navigation}}</nav>
</header>

<!-- Main Template -->
{{> header}}
<main>{{content}}</main>
```

## 🚀 Code Generation

### Scaffolding Tools
```bash
# Yeoman
yo react-component MyComponent

# Plop.js
plop component

# Cookiecutter
cookiecutter python-package
```

### API Generation
```javascript
// Generate REST API
const apiTemplate = `
router.{{method}}('{{endpoint}}', async (req, res) => {
  try {
    const result = await {{service}}.{{action}}(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
`;
```

## 📊 Performance Optimization

### Template Caching
```javascript
class TemplateCache {
  constructor() {
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      this.cache.set(key, this.compile(key));
    }
    return this.cache.get(key);
  }
}
```

### Lazy Loading
```javascript
// Load templates on demand
const loadTemplate = async (name) => {
  const response = await fetch(`/templates/${name}.hbs`);
  return await response.text();
};
```

### Batch Processing
```javascript
// Process multiple templates efficiently
const processBatch = async (templates, data) => {
  return Promise.all(
    templates.map(template => template.render(data))
  );
};
```

## 🔒 Security Best Practices

### Input Validation
```javascript
const validateData = (data) => {
  const schema = {
    name: { type: 'string', maxLength: 100 },
    email: { type: 'email' },
    age: { type: 'number', min: 0, max: 120 }
  };
  return validate(schema, data);
};
```

### XSS Prevention
```javascript
// Auto-escape by default
const template = Handlebars.compile('{{name}}', {
  escapeExpression: Handlebars.escapeExpression
});
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

## 🧪 Testing Strategies

### Unit Testing
```javascript
describe('Template Engine', () => {
  test('renders variables correctly', () => {
    const template = 'Hello {{name}}!';
    const data = { name: 'World' };
    const result = engine.render(template, data);
    expect(result).toBe('Hello World!');
  });
});
```

### Visual Regression Testing
```javascript
const compareScreenshots = async (template, data) => {
  const html = await renderTemplate(template, data);
  const screenshot = await takeScreenshot(html);
  return compareWithBaseline(screenshot);
};
```

## 📈 Monitoring & Debugging

### Performance Monitoring
```javascript
const monitorTemplate = (template, data) => {
  const start = performance.now();
  const result = template.render(data);
  const duration = performance.now() - start;
  
  if (duration > 100) {
    console.warn(`Slow template render: ${duration}ms`);
  }
  
  return result;
};
```

### Error Handling
```javascript
const safeRender = (template, data) => {
  try {
    return template.render(data);
  } catch (error) {
    console.error('Template render error:', error);
    return fallbackTemplate.render(data);
  }
};
```

## 🎨 Design Patterns

### Template Registry
```javascript
class TemplateRegistry {
  constructor() {
    this.templates = new Map();
  }
  
  register(name, template) {
    this.templates.set(name, template);
  }
  
  get(name) {
    return this.templates.get(name);
  }
}
```

### Template Factory
```javascript
class TemplateFactory {
  createTemplate(type, config) {
    switch (type) {
      case 'email': return new EmailTemplate(config);
      case 'web': return new WebTemplate(config);
      case 'document': return new DocumentTemplate(config);
      default: throw new Error(`Unknown template type: ${type}`);
    }
  }
}
```

### Template Pipeline
```javascript
class TemplatePipeline {
  constructor() {
    this.processors = [];
  }
  
  addProcessor(processor) {
    this.processors.push(processor);
  }
  
  process(template, data) {
    return this.processors.reduce(
      (result, processor) => processor(result, data),
      template
    );
  }
}
```

## 🔮 AI & ML Integration

### AI-Assisted Generation
```javascript
const generateTemplate = async (description) => {
  const prompt = `Generate a template for: ${description}`;
  const response = await aiModel.generate(prompt);
  return parseTemplate(response);
};
```

### Personalization
```javascript
const personalizeTemplate = (template, userData) => {
  const userPreferences = analyzeUserBehavior(userData);
  return adaptTemplate(template, userPreferences);
};
```

### A/B Testing
```javascript
const abTestTemplate = (templateA, templateB, userId) => {
  const variant = hashUserId(userId) % 2;
  return variant === 0 ? templateA : templateB;
};
```

## 📚 Learning Path

### Beginner Level
1. **Template Fundamentals** - Basic syntax and concepts
2. **Simple Template Engines** - Handlebars, Mustache
3. **Basic Web Templates** - HTML with variables

### Intermediate Level
1. **Advanced Template Engines** - EJS, Jinja2, Twig
2. **Template Inheritance** - Layouts and partials
3. **Code Generation** - Scaffolding and automation

### Advanced Level
1. **Performance Optimization** - Caching and monitoring
2. **Security Best Practices** - Validation and sanitization
3. **AI Integration** - Machine learning and personalization

## 🛠️ Tools & Libraries

### JavaScript Ecosystem
- **Handlebars** - Logic-less templating
- **EJS** - Embedded JavaScript templates
- **Pug** - Clean, whitespace-sensitive syntax
- **Mustache** - Logic-less templates
- **MJML** - Responsive email framework

### Python Ecosystem
- **Jinja2** - Powerful templating engine
- **Mako** - Fast, lightweight templating
- **docxtpl** - Word document templates
- **ReportLab** - PDF generation

### PHP Ecosystem
- **Twig** - Flexible, fast, secure templating
- **Smarty** - Template engine for PHP
- **Blade** - Laravel's templating engine

### Code Generation Tools
- **Yeoman** - Web app scaffolding
- **Plop.js** - Micro-generator framework
- **Cookiecutter** - Project templates
- **Hygen** - Simple code generator

## 📖 Further Reading

### Books
- "Template Metaprogramming" by David Abrahams
- "Design Patterns" by Gang of Four
- "Clean Code" by Robert C. Martin

### Online Resources
- [Handlebars Documentation](https://handlebarsjs.com/)
- [Jinja2 Documentation](https://jinja.palletsprojects.com/)
- [Twig Documentation](https://twig.symfony.com/)

### Community
- Stack Overflow: `template-engine`, `code-generation`
- GitHub: Search for template engines and generators
- Reddit: r/webdev, r/programming

---

*This quick reference covers the essential concepts from "Mastering Template Generation – From Fundamentals to Advanced Automation". For detailed explanations and examples, refer to the individual chapters.*
