#!/usr/bin/env node

/**
 * Scaffolding Tools Example
 * Demonstrates Yeoman generators and Plop.js micro-generators
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Handlebars = require('handlebars');
const ora = require('ora');

class ScaffoldingTools {
  constructor() {
    this.outputDir = './generated-project';
    this.templatesDir = './templates';
    this.spinner = null;
  }

  async run() {
    console.log(chalk.blue.bold('\n🏗️  Scaffolding Tools Demo\n'));
    
    try {
      await this.setupTemplates();
      await this.demoYeomanGenerator();
      await this.demoPlopGenerators();
      await this.demoProjectScaffolding();
      
      console.log(chalk.green.bold('\n✅ Scaffolding tools demo completed successfully!'));
      console.log(chalk.yellow(`📁 Generated project: ${this.outputDir}`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during scaffolding demo:'), error.message);
    }
  }

  async setupTemplates() {
    this.spinner = ora('Setting up templates...').start();
    
    // Create templates directory
    await fs.ensureDir(this.templatesDir);
    
    // Create template files
    const templates = {
      'react-component.hbs': this.getReactComponentTemplate(),
      'react-service.hbs': this.getReactServiceTemplate(),
      'react-test.hbs': this.getReactTestTemplate(),
      'package.json.hbs': this.getPackageJsonTemplate(),
      'readme.md.hbs': this.getReadmeTemplate(),
      'plopfile.js.hbs': this.getPlopfileTemplate()
    };

    for (const [filename, content] of Object.entries(templates)) {
      await fs.writeFile(path.join(this.templatesDir, filename), content);
    }
    
    this.spinner.succeed('Templates setup completed');
  }

  async demoYeomanGenerator() {
    console.log(chalk.cyan.bold('\n🔧 Yeoman Generator Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'appName',
        message: 'Enter application name:',
        default: 'my-react-app',
        validate: (input) => {
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'App name must be lowercase with hyphens only';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter application description:',
        default: 'A React application generated with Yeoman'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Enter author name:',
        default: 'Developer'
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Choose package manager:',
        choices: ['npm', 'yarn', 'pnpm'],
        default: 'npm'
      }
    ]);

    this.spinner = ora('Generating Yeoman project...').start();
    
    // Simulate Yeoman generator
    const projectDir = path.join(this.outputDir, answers.appName);
    await fs.ensureDir(projectDir);
    
    // Generate project structure
    await this.generateYeomanProject(answers, projectDir);
    
    this.spinner.succeed(`Yeoman project generated: ${answers.appName}`);
  }

  async generateYeomanProject(config, projectDir) {
    const structure = {
      'src': {
        'components': {},
        'services': {},
        'utils': {},
        'styles': {},
        'assets': {}
      },
      'public': {
        'index.html': this.generateIndexHtml(config),
        'favicon.ico': ''
      },
      'tests': {},
      'docs': {},
      '.gitignore': this.generateGitignore(),
      'package.json': this.generatePackageJson(config),
      'README.md': this.generateReadme(config),
      'webpack.config.js': this.generateWebpackConfig(),
      'babel.config.js': this.generateBabelConfig(),
      'jest.config.js': this.generateJestConfig()
    };

    await this.createDirectoryStructure(structure, projectDir);
  }

  async demoPlopGenerators() {
    console.log(chalk.cyan.bold('\n⚡ Plop.js Generators Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'generatorType',
        message: 'Choose generator type:',
        choices: ['component', 'service', 'test', 'all'],
        default: 'all'
      }
    ]);

    this.spinner = ora('Setting up Plop generators...').start();
    
    const plopDir = path.join(this.outputDir, 'plop-demo');
    await fs.ensureDir(plopDir);
    
    // Create plopfile.js
    const plopfile = this.generatePlopfile();
    await fs.writeFile(path.join(plopDir, 'plopfile.js'), plopfile);
    
    // Create plop templates
    await this.createPlopTemplates(plopDir);
    
    this.spinner.succeed('Plop generators setup completed');
    
    // Demo component generation
    if (answers.generatorType === 'component' || answers.generatorType === 'all') {
      await this.demoComponentGeneration(plopDir);
    }
    
    // Demo service generation
    if (answers.generatorType === 'service' || answers.generatorType === 'all') {
      await this.demoServiceGeneration(plopDir);
    }
  }

  async demoComponentGeneration(plopDir) {
    const componentAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter component name:',
        default: 'UserCard',
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
        default: 'name, email, avatar',
        filter: (input) => input.split(',').map(p => p.trim())
      },
      {
        type: 'confirm',
        name: 'withStyles',
        message: 'Include CSS file?',
        default: true
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include test file?',
        default: true
      }
    ]);

    this.spinner = ora('Generating React component...').start();
    
    const componentDir = path.join(plopDir, 'src', 'components', componentAnswers.name);
    await fs.ensureDir(componentDir);
    
    // Generate component files
    await this.generateComponentFiles(componentAnswers, componentDir);
    
    this.spinner.succeed(`Component generated: ${componentAnswers.name}`);
  }

  async generateComponentFiles(config, componentDir) {
    const files = {
      [`${config.name}.jsx`]: this.generateReactComponent(config),
      'index.js': this.generateComponentIndex(config)
    };

    if (config.withStyles) {
      files[`${config.name}.css`] = this.generateComponentStyles(config);
    }

    if (config.withTests) {
      files[`${config.name}.test.js`] = this.generateComponentTest(config);
    }

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(componentDir, filename), content);
    }
  }

  async demoServiceGeneration(plopDir) {
    const serviceAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter service name:',
        default: 'UserService',
        validate: (input) => {
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Service name must be PascalCase';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'type',
        message: 'Choose service type:',
        choices: ['api', 'local', 'websocket'],
        default: 'api'
      },
      {
        type: 'input',
        name: 'endpoints',
        message: 'Enter API endpoints (comma-separated):',
        default: 'getUsers, createUser, updateUser, deleteUser',
        filter: (input) => input.split(',').map(e => e.trim())
      }
    ]);

    this.spinner = ora('Generating service...').start();
    
    const serviceDir = path.join(plopDir, 'src', 'services');
    await fs.ensureDir(serviceDir);
    
    // Generate service files
    await this.generateServiceFiles(serviceAnswers, serviceDir);
    
    this.spinner.succeed(`Service generated: ${serviceAnswers.name}`);
  }

  async generateServiceFiles(config, serviceDir) {
    const files = {
      [`${config.name}.js`]: this.generateService(config),
      [`${config.name}.test.js`]: this.generateServiceTest(config)
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(serviceDir, filename), content);
    }
  }

  async demoProjectScaffolding() {
    console.log(chalk.cyan.bold('\n🏗️  Project Scaffolding Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectType',
        message: 'Choose project type:',
        choices: ['react-app', 'node-api', 'fullstack', 'library'],
        default: 'react-app'
      },
      {
        type: 'confirm',
        name: 'withTesting',
        message: 'Include testing setup?',
        default: true
      },
      {
        type: 'confirm',
        name: 'withLinting',
        message: 'Include linting configuration?',
        default: true
      },
      {
        type: 'confirm',
        name: 'withCI',
        message: 'Include CI/CD configuration?',
        default: false
      }
    ]);

    this.spinner = ora('Scaffolding project structure...').start();
    
    const scaffoldDir = path.join(this.outputDir, 'scaffold-demo');
    await fs.ensureDir(scaffoldDir);
    
    // Generate project structure based on type
    await this.generateProjectStructure(answers, scaffoldDir);
    
    this.spinner.succeed('Project scaffolding completed');
  }

  async generateProjectStructure(config, projectDir) {
    const structure = this.getProjectStructure(config);
    await this.createDirectoryStructure(structure, projectDir);
  }

  getProjectStructure(config) {
    const baseStructure = {
      'src': {},
      'docs': {},
      '.gitignore': this.generateGitignore(),
      'README.md': this.generateReadme({ appName: 'scaffold-demo' })
    };

    if (config.projectType === 'react-app') {
      baseStructure.src = {
        'components': {},
        'pages': {},
        'hooks': {},
        'utils': {},
        'styles': {},
        'assets': {}
      };
      baseStructure.public = {
        'index.html': this.generateIndexHtml({ appName: 'React App' })
      };
    } else if (config.projectType === 'node-api') {
      baseStructure.src = {
        'controllers': {},
        'models': {},
        'routes': {},
        'middleware': {},
        'utils': {},
        'config': {}
      };
    }

    if (config.withTesting) {
      baseStructure.tests = {};
      baseStructure['jest.config.js'] = this.generateJestConfig();
    }

    if (config.withLinting) {
      baseStructure['.eslintrc.js'] = this.generateEslintConfig();
      baseStructure['.prettierrc'] = this.generatePrettierConfig();
    }

    if (config.withCI) {
      baseStructure['.github'] = {
        'workflows': {
          'ci.yml': this.generateCIConfig()
        }
      };
    }

    return baseStructure;
  }

  async createDirectoryStructure(structure, basePath) {
    for (const [name, content] of Object.entries(structure)) {
      const fullPath = path.join(basePath, name);
      
      if (typeof content === 'object' && content !== null) {
        await fs.ensureDir(fullPath);
        await this.createDirectoryStructure(content, fullPath);
      } else {
        await fs.writeFile(fullPath, content || '');
      }
    }
  }

  // Template generation methods
  getReactComponentTemplate() {
    return `import React from 'react';
import PropTypes from 'prop-types';
{{#if withStyles}}import './{{componentName}}.css';{{/if}}

const {{componentName}} = ({ {{props}} }) => {
  return (
    <div className="{{componentNameLowerCase}}">
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

  getReactServiceTemplate() {
    return `class {{serviceName}} {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
  }

  {{#each endpoints}}
  async {{this}}({{getParams this}}) {
    try {
      const response = await fetch(\`\${this.baseUrl}/{{getEndpoint this}}\`, {
        method: '{{getMethod this}}',
        headers: {
          'Content-Type': 'application/json',
        },
        {{#if hasBody this}}body: JSON.stringify(data),{{/if}}
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('{{serviceName}}.{{this}} error:', error);
      throw error;
    }
  }
  {{/each}}
}

export default new {{serviceName}}();`;
  }

  getReactTestTemplate() {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {{componentName}} from './{{componentName}}';

describe('{{componentName}}', () => {
  const defaultProps = {
    {{#each props}}
    {{this}}: {{getTestValue this}},
    {{/each}}
  };

  it('renders without crashing', () => {
    render(<{{componentName}} {...defaultProps} />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  {{#each props}}
  it('displays {{this}} prop', () => {
    render(<{{componentName}} {...defaultProps} />);
    expect(screen.getByText(defaultProps.{{this}})).toBeInTheDocument();
  });
  {{/each}}
});`;
  }

  getPackageJsonTemplate() {
    return `{
  "name": "{{appName}}",
  "version": "1.0.0",
  "description": "{{description}}",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3"
  },
  "author": "{{author}}",
  "license": "MIT"
}`;
  }

  getReadmeTemplate() {
    return `# {{appName}}

{{description}}

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm start
\`\`\`

### Testing

\`\`\`bash
npm test
\`\`\`

### Building

\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
src/
├── components/     # React components
├── services/       # API services
├── utils/          # Utility functions
├── styles/         # CSS files
└── assets/         # Static assets
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
`;
  }

  getPlopfileTemplate() {
    return `module.exports = function(plop) {
  // Component generator
  plop.setGenerator('component', {
    description: 'Create a React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
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
        message: 'Component props (comma-separated):',
        default: 'name, value',
        filter: (input) => input.split(',').map(p => p.trim())
      },
      {
        type: 'confirm',
        name: 'withStyles',
        message: 'Include CSS file?',
        default: true
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include test file?',
        default: true
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.jsx',
        templateFile: 'plop-templates/component.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/index.js',
        templateFile: 'plop-templates/component-index.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.css',
        templateFile: 'plop-templates/component-styles.hbs',
        skipIfExists: true
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.test.js',
        templateFile: 'plop-templates/component-test.hbs',
        skipIfExists: true
      }
    ]
  });

  // Service generator
  plop.setGenerator('service', {
    description: 'Create a service',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Service name:',
        validate: (input) => {
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Service name must be PascalCase';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'type',
        message: 'Service type:',
        choices: ['api', 'local', 'websocket'],
        default: 'api'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/services/{{name}}.js',
        templateFile: 'plop-templates/service.hbs'
      },
      {
        type: 'add',
        path: 'src/services/{{name}}.test.js',
        templateFile: 'plop-templates/service-test.hbs'
      }
    ]
  });
};`;
  }

  // Helper methods for generating content
  generateReactComponent(config) {
    const template = Handlebars.compile(this.getReactComponentTemplate());
    return template({
      ...config,
      componentNameLowerCase: config.name.toLowerCase(),
      getPropType: (prop) => this.getPropType(prop),
      getDefaultValue: (prop) => this.getDefaultValue(prop)
    });
  }

  generateComponentIndex(config) {
    return `export { default } from './${config.name}';`;
  }

  generateComponentStyles(config) {
    return `.${config.name.toLowerCase()} {
  /* Component styles */
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

${config.props.map(prop => `.${config.name.toLowerCase()}__${prop} {
  /* ${prop} prop styles */
  margin-bottom: 0.5rem;
}`).join('\n\n')}`;
  }

  generateComponentTest(config) {
    const template = Handlebars.compile(this.getReactTestTemplate());
    return template({
      ...config,
      getTestValue: (prop) => this.getTestValue(prop)
    });
  }

  generateService(config) {
    const template = Handlebars.compile(this.getReactServiceTemplate());
    return template({
      ...config,
      getParams: (endpoint) => this.getServiceParams(endpoint),
      getEndpoint: (endpoint) => this.getServiceEndpoint(endpoint),
      getMethod: (endpoint) => this.getServiceMethod(endpoint),
      hasBody: (endpoint) => this.hasServiceBody(endpoint)
    });
  }

  generateServiceTest(config) {
    return `import ${config.name} from './${config.name}';

describe('${config.name}', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  ${config.endpoints.map(endpoint => `
  describe('${endpoint}', () => {
    it('should make successful API call', async () => {
      const mockResponse = { data: 'test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await ${config.name}.${endpoint}();
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(${config.name}.${endpoint}()).rejects.toThrow();
    });
  });`).join('\n')}
});`;
  }

  generateIndexHtml(config) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${config.description || 'React App'}" />
    <title>${config.appName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;
  }

  generatePackageJson(config) {
    const template = Handlebars.compile(this.getPackageJsonTemplate());
    return template(config);
  }

  generateReadme(config) {
    const template = Handlebars.compile(this.getReadmeTemplate());
    return template(config);
  }

  generatePlopfile() {
    const template = Handlebars.compile(this.getPlopfileTemplate());
    return template({});
  }

  generateGitignore() {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity`;
  }

  generateWebpackConfig() {
    return `const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
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
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: './dist',
    hot: true,
  },
};`;
  }

  generateBabelConfig() {
    return `module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
};`;
  }

  generateJestConfig() {
    return `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
};`;
  }

  generateEslintConfig() {
    return `module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};`;
  }

  generatePrettierConfig() {
    return `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}`;
  }

  generateCIConfig() {
    return `name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: \${{ matrix.node-version }}
    - run: npm ci
    - run: npm test
    - run: npm run build`;
  }

  async createPlopTemplates(plopDir) {
    const templatesDir = path.join(plopDir, 'plop-templates');
    await fs.ensureDir(templatesDir);
    
    const templates = {
      'component.hbs': this.getReactComponentTemplate(),
      'component-index.hbs': 'export { default } from \'./{{name}}\';',
      'component-styles.hbs': this.generateComponentStyles({ name: '{{name}}', props: ['{{props}}'] }),
      'component-test.hbs': this.getReactTestTemplate(),
      'service.hbs': this.getReactServiceTemplate(),
      'service-test.hbs': this.generateServiceTest({ name: '{{name}}', endpoints: ['{{endpoints}}'] })
    };

    for (const [filename, content] of Object.entries(templates)) {
      await fs.writeFile(path.join(templatesDir, filename), content);
    }
  }

  // Helper methods for template processing
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

  getServiceParams(endpoint) {
    const paramMap = {
      'getUsers': '',
      'createUser': 'data',
      'updateUser': 'id, data',
      'deleteUser': 'id'
    };
    return paramMap[endpoint] || '';
  }

  getServiceEndpoint(endpoint) {
    return endpoint.replace(/^get|create|update|delete/, '').toLowerCase() + 's';
  }

  getServiceMethod(endpoint) {
    if (endpoint.startsWith('get')) return 'GET';
    if (endpoint.startsWith('create')) return 'POST';
    if (endpoint.startsWith('update')) return 'PUT';
    if (endpoint.startsWith('delete')) return 'DELETE';
    return 'GET';
  }

  hasServiceBody(endpoint) {
    return endpoint.startsWith('create') || endpoint.startsWith('update');
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new ScaffoldingTools();
  demo.run().catch(console.error);
}

module.exports = ScaffoldingTools;
