# Chapter 5: Code Generation with Templates

## Overview

This chapter explores how templates are used for code generation, scaffolding, and automation. We'll cover scaffolding tools, code generators, IDE integration, and advanced automation techniques that help developers create consistent, boilerplate-free code.

## Table of Contents

1. [Code Generation Fundamentals](#code-generation-fundamentals)
2. [Scaffolding Tools](#scaffolding-tools)
3. [Code Generators](#code-generators)
4. [IDE Integration](#ide-integration)
5. [Advanced Code Generation](#advanced-code-generation)
6. [Best Practices](#best-practices)

## Code Generation Fundamentals

### What is Code Generation?

Code generation is the process of automatically creating source code from templates, specifications, or other input sources. It helps:

- **Reduce Boilerplate**: Eliminate repetitive code patterns
- **Ensure Consistency**: Maintain coding standards across projects
- **Increase Productivity**: Generate complex structures quickly
- **Reduce Errors**: Minimize manual coding mistakes

### Code Generation Types

1. **Scaffolding**: Creating project structure and initial files
2. **CRUD Generation**: Database operations and API endpoints
3. **Component Generation**: UI components and modules
4. **Configuration Generation**: Settings and config files
5. **Documentation Generation**: API docs and code comments

### Code Generation Workflow

```
Input → Template Engine → Code Generator → Output
  ↓           ↓              ↓           ↓
Specs    Templates      Processing    Generated
Models   Patterns       Logic         Code
```

## Scaffolding Tools

### Yeoman Generators

Yeoman is a popular scaffolding tool for web applications:

```javascript
// Basic Yeoman generator structure
class MyGenerator extends Generator {
  prompting() {
    // Collect user input
  }
  
  writing() {
    // Generate files from templates
  }
  
  install() {
    // Install dependencies
  }
}
```

### Plop.js

Plop.js is a micro-generator framework:

```javascript
// plopfile.js
module.exports = function(plop) {
  plop.setGenerator('component', {
    description: 'Create a React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.jsx',
        templateFile: 'plop-templates/component.hbs'
      }
    ]
  });
};
```

### Cookiecutter

Cookiecutter is a Python-based project generator:

```python
# cookiecutter.json
{
  "project_name": "My Project",
  "author_name": "Your Name",
  "email": "your.email@example.com",
  "description": "A short description",
  "python_version": ["3.8", "3.9", "3.10"]
}
```

## Code Generators

### API Code Generation

Generate REST API endpoints from database schemas:

```javascript
// Generate CRUD operations
class APIGenerator {
  generateCRUD(model) {
    return {
      routes: this.generateRoutes(model),
      controller: this.generateController(model),
      service: this.generateService(model),
      validation: this.generateValidation(model)
    };
  }
}
```

### Database Code Generation

Generate database models and migrations:

```python
# SQLAlchemy model generator
class ModelGenerator:
    def generate_model(self, table_name, columns):
        template = """
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class {{ model_name }}(Base):
    __tablename__ = '{{ table_name }}'
    
    {% for column in columns %}
    {{ column.name }} = Column({{ column.type }}{% if column.primary_key %}, primary_key=True{% endif %})
    {% endfor %}
        """
        return self.render_template(template, {
            'model_name': self.to_camel_case(table_name),
            'table_name': table_name,
            'columns': columns
        })
```

### Frontend Component Generation

Generate React/Vue components with consistent patterns:

```javascript
// React component generator
class ComponentGenerator {
  generateComponent(name, props = []) {
    return `
import React from 'react';
import PropTypes from 'prop-types';
import './${name}.css';

const ${name} = ({ ${props.join(', ')} }) => {
  return (
    <div className="${name.toLowerCase()}">
      {/* Component content */}
    </div>
  );
};

${name}.propTypes = {
  ${props.map(prop => `${prop}: PropTypes.${this.getPropType(prop)}`).join(',\n  ')}
};

export default ${name};
    `.trim();
  }
}
```

## IDE Integration

### VS Code Extensions

Create custom VS Code extensions for code generation:

```javascript
// extension.js
const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'extension.generateComponent',
    async () => {
      const name = await vscode.window.showInputBox({
        prompt: 'Enter component name'
      });
      
      if (name) {
        const component = generateComponent(name);
        const document = await vscode.workspace.openTextDocument({
          content: component,
          language: 'javascript'
        });
        await vscode.window.showTextDocument(document);
      }
    }
  );
  
  context.subscriptions.push(disposable);
}
```

### IntelliJ IDEA Plugins

Create IntelliJ plugins for Java/Kotlin code generation:

```java
// Action class for IntelliJ plugin
public class GenerateServiceAction extends AnAction {
    @Override
    public void actionPerformed(AnActionEvent e) {
        Project project = e.getProject();
        if (project != null) {
            GenerateServiceDialog dialog = new GenerateServiceDialog(project);
            dialog.show();
        }
    }
}
```

### Snippets and Templates

Create code snippets for common patterns:

```json
// VS Code snippets
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "const ${1:ComponentName} = () => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ]
  }
}
```

## Advanced Code Generation

### AST-Based Generation

Use Abstract Syntax Trees for complex code transformations:

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

class ASTCodeGenerator {
  transformCode(code, transformations) {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    
    traverse(ast, transformations);
    
    return generate(ast).code;
  }
  
  addImports(ast, imports) {
    traverse(ast, {
      Program(path) {
        imports.forEach(imp => {
          path.node.body.unshift(imp);
        });
      }
    });
  }
}
```

### Metaprogramming

Use metaprogramming techniques for dynamic code generation:

```python
# Python metaprogramming example
class ModelMeta(type):
    def __new__(cls, name, bases, attrs):
        # Generate methods based on attributes
        for field_name in attrs.get('fields', []):
            attrs[f'get_{field_name}'] = cls._create_getter(field_name)
            attrs[f'set_{field_name}'] = cls._create_setter(field_name)
        
        return super().__new__(cls, name, bases, attrs)
    
    @staticmethod
    def _create_getter(field_name):
        def getter(self):
            return getattr(self, f'_{field_name}')
        return getter
    
    @staticmethod
    def _create_setter(field_name):
        def setter(self, value):
            setattr(self, f'_{field_name}', value)
        return setter
```

### Code Generation from Schemas

Generate code from JSON schemas, OpenAPI specs, or database schemas:

```javascript
// OpenAPI to TypeScript generator
class OpenAPIGenerator {
  generateTypes(spec) {
    const types = [];
    
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      types.push(this.generateType(name, schema));
    }
    
    return types.join('\n\n');
  }
  
  generateType(name, schema) {
    return `
export interface ${name} {
  ${this.generateProperties(schema.properties)}
}
    `.trim();
  }
  
  generateProperties(properties) {
    return Object.entries(properties)
      .map(([key, prop]) => `  ${key}${prop.required ? '' : '?'}: ${this.getTypeScriptType(prop)};`)
      .join('\n');
  }
}
```

## Best Practices

### Template Design

1. **Keep Templates Simple**: Avoid complex logic in templates
2. **Use Clear Naming**: Make template variables self-documenting
3. **Provide Defaults**: Include sensible default values
4. **Validate Input**: Check template parameters before generation

### Code Quality

1. **Follow Standards**: Generate code that follows project conventions
2. **Include Comments**: Add helpful comments to generated code
3. **Handle Edge Cases**: Consider error conditions and edge cases
4. **Test Generated Code**: Ensure generated code works correctly

### Maintainability

1. **Version Templates**: Track template changes over time
2. **Document Templates**: Explain template purpose and usage
3. **Modular Design**: Break complex templates into smaller parts
4. **Configuration**: Make templates configurable and flexible

### Performance

1. **Cache Templates**: Avoid re-parsing templates repeatedly
2. **Batch Generation**: Process multiple files efficiently
3. **Incremental Updates**: Only regenerate changed files
4. **Parallel Processing**: Use multiple threads for large projects

## Summary

Code generation with templates is a powerful technique for automating repetitive coding tasks and maintaining consistency across projects. By understanding the fundamentals, using appropriate tools, and following best practices, developers can significantly improve their productivity and code quality.

The key takeaways from this chapter are:

- **Scaffolding tools** help create project structure quickly
- **Code generators** automate repetitive coding patterns
- **IDE integration** provides seamless development experience
- **Advanced techniques** enable complex code transformations
- **Best practices** ensure maintainable and reliable generated code

In the next chapter, we'll explore best practices for template development and usage across all the areas we've covered so far.
