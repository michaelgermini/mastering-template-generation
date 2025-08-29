# Chapter 5: Code Generation with Templates - Examples

This directory contains practical examples demonstrating code generation techniques, scaffolding tools, and automation systems for creating consistent, boilerplate-free code.

## 📁 File Structure

```
examples/
├── README.md                           # This file
├── scaffolding-tools.js               # Yeoman and Plop.js examples
├── code-generators.js                 # API, component, and model generators
├── ide-integration.js                 # VS Code extension examples
└── advanced-generation.js             # AST-based and schema-driven generation
```

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install additional tools
npm install -g yo plop
```

### Running Examples

```bash
# Run scaffolding tools example
node scaffolding-tools.js

# Run code generators example
node code-generators.js

# Run IDE integration example
node ide-integration.js

# Run advanced generation example
node advanced-generation.js
```

## 📋 Examples Overview

### 1. Scaffolding Tools (`scaffolding-tools.js`)

Demonstrates Yeoman generators and Plop.js micro-generators:

**Features:**
- Yeoman generator for React applications
- Plop.js generators for components, services, and tests
- Project structure scaffolding
- Interactive prompts and validation

**Usage:**
```bash
node scaffolding-tools.js
```

**Generated Output:**
- React project structure
- Component files with consistent patterns
- Service layer with CRUD operations
- Test files with proper setup

### 2. Code Generators (`code-generators.js`)

Shows various code generation patterns:

**Features:**
- API endpoint generation from schemas
- Database model generation
- React component generation
- Configuration file generation
- Documentation generation

**Usage:**
```bash
node code-generators.js
```

**Generated Output:**
- REST API routes and controllers
- SQLAlchemy models
- React components with PropTypes
- Configuration files
- API documentation

### 3. IDE Integration (`ide-integration.js`)

Demonstrates IDE integration patterns:

**Features:**
- VS Code extension structure
- Code snippets generation
- Command palette integration
- File system operations
- Template management

**Usage:**
```bash
node ide-integration.js
```

**Generated Output:**
- VS Code extension package
- Code snippets for common patterns
- Command implementations
- Extension configuration

### 4. Advanced Generation (`advanced-generation.js`)

Shows advanced code generation techniques:

**Features:**
- AST-based code transformation
- Schema-driven generation
- Metaprogramming examples
- Code analysis and modification
- Type generation from OpenAPI specs

**Usage:**
```bash
node advanced-generation.js
```

**Generated Output:**
- Transformed JavaScript code
- TypeScript interfaces from schemas
- Metaprogramming examples
- Code analysis reports

## 🔧 Configuration

### Template Configuration

Each generator can be configured through:

```javascript
// Generator configuration
const config = {
  templates: {
    component: './templates/component.hbs',
    service: './templates/service.hbs',
    test: './templates/test.hbs'
  },
  output: {
    components: './src/components',
    services: './src/services',
    tests: './src/__tests__'
  },
  naming: {
    component: 'PascalCase',
    file: 'kebab-case',
    variable: 'camelCase'
  }
};
```

### Custom Templates

Create custom templates in the `templates/` directory:

```handlebars
<!-- templates/component.hbs -->
import React from 'react';
import PropTypes from 'prop-types';

const {{componentName}} = ({ {{props}} }) => {
  return (
    <div className="{{componentNameLowerCase}}">
      {{content}}
    </div>
  );
};

{{componentName}}.propTypes = {
  {{#each props}}
  {{this}}: PropTypes.{{getPropType this}},
  {{/each}}
};

export default {{componentName}};
```

## 🎯 Key Concepts Demonstrated

### 1. Template-Driven Generation

- **Separation of Concerns**: Templates separate structure from logic
- **Reusability**: Templates can be used across multiple generators
- **Maintainability**: Changes to templates affect all generated code

### 2. Interactive Generation

- **User Input**: Collecting requirements through prompts
- **Validation**: Ensuring input meets requirements
- **Default Values**: Providing sensible defaults

### 3. Code Quality

- **Consistency**: Generated code follows project standards
- **Documentation**: Automatic comment generation
- **Testing**: Generated test files with proper setup

### 4. Advanced Techniques

- **AST Manipulation**: Programmatic code modification
- **Schema Processing**: Generating code from specifications
- **Metaprogramming**: Dynamic code generation

## 🚀 Performance Considerations

### Template Caching

```javascript
// Cache compiled templates
const templateCache = new Map();

function getTemplate(name) {
  if (!templateCache.has(name)) {
    const template = Handlebars.compile(fs.readFileSync(`./templates/${name}.hbs`, 'utf8'));
    templateCache.set(name, template);
  }
  return templateCache.get(name);
}
```

### Batch Processing

```javascript
// Process multiple files efficiently
async function generateBatch(items) {
  const promises = items.map(item => generateFile(item));
  return Promise.all(promises);
}
```

### Incremental Generation

```javascript
// Only regenerate changed files
function shouldRegenerate(file, template) {
  const fileHash = getFileHash(file);
  const templateHash = getFileHash(template);
  return fileHash !== templateHash;
}
```

## 🔒 Security Considerations

### Input Validation

```javascript
// Validate user input
function validateComponentName(name) {
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    throw new Error('Component name must be PascalCase');
  }
  return name;
}
```

### Path Safety

```javascript
// Prevent directory traversal
function sanitizePath(path) {
  return path.replace(/\.\./g, '').replace(/[<>:"|?*]/g, '');
}
```

### Template Security

```javascript
// Escape user input in templates
function escapeTemplateInput(input) {
  return input.replace(/[<>&"']/g, (char) => {
    const entities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
    return entities[char];
  });
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run tests
npm test

# Run specific test
npm test -- --grep "Code Generator"
```

### Integration Tests

```bash
# Test generated code
npm run test:generated

# Validate output structure
npm run validate:output
```

### Example Test

```javascript
describe('Component Generator', () => {
  it('should generate valid React component', () => {
    const component = generateComponent('TestComponent', ['name', 'age']);
    expect(component).toContain('import React');
    expect(component).toContain('const TestComponent');
    expect(component).toContain('PropTypes');
  });
});
```

## 📚 Learning Path

1. **Start with Scaffolding Tools**: Understand basic project generation
2. **Explore Code Generators**: Learn pattern-based code generation
3. **Study IDE Integration**: See how tools integrate with development environments
4. **Master Advanced Techniques**: Understand AST manipulation and metaprogramming

## 🎯 Success Metrics

- **Productivity**: Reduce time to create new components by 80%
- **Consistency**: Ensure 100% adherence to coding standards
- **Quality**: Generate testable, documented code automatically
- **Maintainability**: Easy template updates affect all generated code

## 🔗 Related Resources

- [Yeoman Documentation](https://yeoman.io/)
- [Plop.js Documentation](https://plopjs.com/)
- [Handlebars Documentation](https://handlebarsjs.com/)
- [Babel AST Explorer](https://astexplorer.net/)
- [OpenAPI Specification](https://swagger.io/specification/)

## 🤝 Contributing

To add new examples or improve existing ones:

1. Create a new file in the `examples/` directory
2. Update this README with documentation
3. Add tests for new functionality
4. Follow the established patterns and conventions

## 📄 License

This project is part of the "Mastering Template Generation" book and follows the same license terms.
