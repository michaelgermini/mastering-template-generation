#!/usr/bin/env node

/**
 * Code Generators Example
 * Demonstrates various code generation patterns for APIs, models, components, and configs
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Handlebars = require('handlebars');
const ora = require('ora');

class CodeGenerators {
  constructor() {
    this.outputDir = './generated-code';
    this.templatesDir = './code-templates';
    this.spinner = null;
  }

  async run() {
    console.log(chalk.blue.bold('\n⚙️  Code Generators Demo\n'));
    
    try {
      await this.setupTemplates();
      await this.demoAPIGeneration();
      await this.demoComponentGeneration();
      await this.demoConfigGeneration();
      
      console.log(chalk.green.bold('\n✅ Code generation demo completed successfully!'));
      console.log(chalk.yellow(`📁 Generated code: ${this.outputDir}`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during code generation demo:'), error.message);
    }
  }

  async setupTemplates() {
    this.spinner = ora('Setting up code generation templates...').start();
    
    await fs.ensureDir(this.templatesDir);
    
    const templates = {
      'api-controller.hbs': this.getAPIControllerTemplate(),
      'api-service.hbs': this.getAPIServiceTemplate(),
      'react-component.hbs': this.getReactComponentTemplate(),
      'config-file.hbs': this.getConfigFileTemplate()
    };

    for (const [filename, content] of Object.entries(templates)) {
      await fs.writeFile(path.join(this.templatesDir, filename), content);
    }
    
    this.spinner.succeed('Code generation templates setup completed');
  }

  async demoAPIGeneration() {
    console.log(chalk.cyan.bold('\n🌐 API Code Generation Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'modelName',
        message: 'Enter model name (e.g., User, Product):',
        default: 'User',
        validate: (input) => {
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Model name must be PascalCase';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'fields',
        message: 'Enter model fields (comma-separated, e.g., name,email,age):',
        default: 'name, email, age, isActive',
        filter: (input) => input.split(',').map(f => f.trim())
      }
    ]);

    this.spinner = ora('Generating API code...').start();
    
    const apiDir = path.join(this.outputDir, 'api', answers.modelName.toLowerCase());
    await fs.ensureDir(apiDir);
    
    // Generate API files
    await this.generateAPIFiles(answers, apiDir);
    
    this.spinner.succeed(`API code generated for ${answers.modelName}`);
  }

  async generateAPIFiles(config, apiDir) {
    const files = {
      'controller.js': this.generateAPIController(config),
      'service.js': this.generateAPIService(config),
      'routes.js': this.generateAPIRoutes(config)
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(apiDir, filename), content);
    }
  }

  async demoComponentGeneration() {
    console.log(chalk.cyan.bold('\n⚛️  React Component Generation Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'componentName',
        message: 'Enter component name:',
        default: 'UserProfile',
        validate: (input) => {
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Component name must be PascalCase';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'props',
        message: 'Enter component props (comma-separated):',
        default: 'user, onEdit, onDelete',
        filter: (input) => input.split(',').map(p => p.trim())
      }
    ]);

    this.spinner = ora('Generating React component...').start();
    
    const componentDir = path.join(this.outputDir, 'components', answers.componentName);
    await fs.ensureDir(componentDir);
    
    // Generate component files
    await this.generateComponentFiles(answers, componentDir);
    
    this.spinner.succeed(`React component generated: ${answers.componentName}`);
  }

  async generateComponentFiles(config, componentDir) {
    const files = {
      [`${config.componentName}.jsx`]: this.generateReactComponent(config),
      'index.js': this.generateComponentIndex(config),
      [`${config.componentName}.test.js`]: this.generateComponentTest(config)
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(componentDir, filename), content);
    }
  }

  async demoConfigGeneration() {
    console.log(chalk.cyan.bold('\n⚙️  Configuration Generation Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'configType',
        message: 'Choose configuration type:',
        choices: ['webpack', 'babel', 'eslint', 'jest'],
        default: 'webpack'
      }
    ]);

    this.spinner = ora('Generating configuration files...').start();
    
    const configDir = path.join(this.outputDir, 'config');
    await fs.ensureDir(configDir);
    
    // Generate configuration files
    await this.generateConfigFiles(answers, configDir);
    
    this.spinner.succeed('Configuration files generated');
  }

  async generateConfigFiles(config, configDir) {
    const content = this.generateConfigFile(config.configType, config);
    const filename = this.getConfigFilename(config.configType);
    await fs.writeFile(path.join(configDir, filename), content);
  }

  // Template generation methods
  getAPIControllerTemplate() {
    return `const {{serviceName}} = require('./{{serviceName}}');

class {{controllerName}} {
  async getAll(req, res) {
    try {
      const {{modelNameLowerCase}}s = await {{serviceName}}.findAll();
      res.json({ success: true, data: {{modelNameLowerCase}}s });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const {{modelNameLowerCase}} = await {{serviceName}}.findById(id);
      
      if (!{{modelNameLowerCase}}) {
        return res.status(404).json({ success: false, error: '{{modelName}} not found' });
      }
      
      res.json({ success: true, data: {{modelNameLowerCase}} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const {{modelNameLowerCase}} = await {{serviceName}}.create(req.body);
      res.status(201).json({ success: true, data: {{modelNameLowerCase}} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const {{modelNameLowerCase}} = await {{serviceName}}.update(id, req.body);
      if (!{{modelNameLowerCase}}) {
        return res.status(404).json({ success: false, error: '{{modelName}} not found' });
      }
      res.json({ success: true, data: {{modelNameLowerCase}} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await {{serviceName}}.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ success: false, error: '{{modelName}} not found' });
      }

      res.json({ success: true, message: '{{modelName}} deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new {{controllerName}}();`;
  }

  getAPIServiceTemplate() {
    return `class {{serviceName}} {
  async findAll(options = {}) {
    try {
      // Implementation for finding all {{modelNameLowerCase}}s
      return [];
    } catch (error) {
      throw new Error(\`Error fetching {{modelNameLowerCase}}s: \${error.message}\`);
    }
  }

  async findById(id, options = {}) {
    try {
      // Implementation for finding {{modelNameLowerCase}} by id
      return null;
    } catch (error) {
      throw new Error(\`Error fetching {{modelNameLowerCase}} by id: \${error.message}\`);
    }
  }

  async create(data) {
    try {
      // Implementation for creating {{modelNameLowerCase}}
      return data;
    } catch (error) {
      throw new Error(\`Error creating {{modelNameLowerCase}}: \${error.message}\`);
    }
  }

  async update(id, data) {
    try {
      // Implementation for updating {{modelNameLowerCase}}
      return data;
    } catch (error) {
      throw new Error(\`Error updating {{modelNameLowerCase}}: \${error.message}\`);
    }
  }

  async delete(id) {
    try {
      // Implementation for deleting {{modelNameLowerCase}}
      return true;
    } catch (error) {
      throw new Error(\`Error deleting {{modelNameLowerCase}}: \${error.message}\`);
    }
  }
}

module.exports = new {{serviceName}}();`;
  }

  getReactComponentTemplate() {
    return `import React from 'react';
import PropTypes from 'prop-types';

const {{componentName}} = ({ {{props}} }) => {
  return (
    <div className="{{componentNameLowerCase}}">
      <h2>{{componentName}}</h2>
      {{#each props}}
      <div className="{{componentNameLowerCase}}__{{this}}">
        { {{this}} }
      </div>
      {{/each}}
    </div>
  );
};

{{componentName}}.propTypes = {
  {{#each props}}
  {{this}}: PropTypes.{{getPropType this}},
  {{/each}}
};

{{componentName}}.defaultProps = {
  {{#each props}}
  {{this}}: {{getDefaultValue this}},
  {{/each}}
};

export default {{componentName}};`;
  }

  getConfigFileTemplate() {
    return `module.exports = {
  // {{configType}} configuration
  {{#if (eq configType "webpack")}}
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  {{else if (eq configType "babel")}}
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
  ],
  {{else if (eq configType "eslint")}}
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  {{else if (eq configType "jest")}}
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  {{/if}}
};`;
  }

  // Helper methods for generating content
  generateAPIController(config) {
    const template = Handlebars.compile(this.getAPIControllerTemplate());
    return template({
      ...config,
      controllerName: `${config.modelName}Controller`,
      serviceName: `${config.modelName}Service`,
      modelNameLowerCase: config.modelName.toLowerCase()
    });
  }

  generateAPIService(config) {
    const template = Handlebars.compile(this.getAPIServiceTemplate());
    return template({
      ...config,
      serviceName: `${config.modelName}Service`,
      modelNameLowerCase: config.modelName.toLowerCase()
    });
  }

  generateAPIRoutes(config) {
    return `const express = require('express');
const ${config.modelName}Controller = require('./${config.modelName}Controller');

const router = express.Router();

// GET /${config.modelName.toLowerCase()}s
router.get('/', ${config.modelName}Controller.getAll);

// GET /${config.modelName.toLowerCase()}s/:id
router.get('/:id', ${config.modelName}Controller.getById);

// POST /${config.modelName.toLowerCase()}s
router.post('/', ${config.modelName}Controller.create);

// PUT /${config.modelName.toLowerCase()}s/:id
router.put('/:id', ${config.modelName}Controller.update);

// DELETE /${config.modelName.toLowerCase()}s/:id
router.delete('/:id', ${config.modelName}Controller.delete);

module.exports = router;`;
  }

  generateReactComponent(config) {
    const template = Handlebars.compile(this.getReactComponentTemplate());
    return template({
      ...config,
      componentNameLowerCase: config.componentName.toLowerCase(),
      getPropType: (prop) => this.getPropType(prop),
      getDefaultValue: (prop) => this.getDefaultValue(prop)
    });
  }

  generateConfigFile(type, config) {
    const template = Handlebars.compile(this.getConfigFileTemplate());
    return template({
      ...config,
      configType: type
    });
  }

  generateComponentIndex(config) {
    return `export { default } from './${config.componentName}';`;
  }

  generateComponentTest(config) {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${config.componentName} from './${config.componentName}';

describe('${config.componentName}', () => {
  const defaultProps = {
    ${config.props.map(prop => `${prop}: ${this.getTestValue(prop)}`).join(',\n    ')}
  };

  it('renders without crashing', () => {
    render(<${config.componentName} {...defaultProps} />);
    expect(screen.getByText('${config.componentName}')).toBeInTheDocument();
  });

  ${config.props.map(prop => `
  it('displays ${prop} prop', () => {
    render(<${config.componentName} {...defaultProps} />);
    expect(screen.getByText(defaultProps.${prop})).toBeInTheDocument();
  });`).join('\n')}
});`;
  }

  // Helper utility methods
  getPropType(prop) {
    const typeMap = {
      'name': 'string',
      'email': 'string',
      'avatar': 'string',
      'age': 'number',
      'isActive': 'bool',
      'items': 'array',
      'user': 'object'
    };
    return typeMap[prop] || 'string';
  }

  getDefaultValue(prop) {
    const defaultMap = {
      'name': '""',
      'email': '""',
      'avatar': '""',
      'age': '0',
      'isActive': 'false',
      'items': '[]',
      'user': '{}'
    };
    return defaultMap[prop] || '""';
  }

  getTestValue(prop) {
    const testMap = {
      'name': '"Test User"',
      'email': '"test@example.com"',
      'avatar': '"https://example.com/avatar.jpg"',
      'age': '25',
      'isActive': 'true',
      'items': '["item1", "item2"]',
      'user': '{ id: 1, name: "Test User" }'
    };
    return testMap[prop] || '"test"';
  }

  getConfigFilename(type) {
    const filenameMap = {
      'webpack': 'webpack.config.js',
      'babel': '.babelrc',
      'eslint': '.eslintrc.js',
      'jest': 'jest.config.js'
    };
    return filenameMap[type] || `${type}.config.js`;
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new CodeGenerators();
  demo.run().catch(console.error);
}

module.exports = CodeGenerators;
