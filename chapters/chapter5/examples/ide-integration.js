#!/usr/bin/env node

/**
 * IDE Integration Example
 * Demonstrates IDE integration patterns for code generation
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

class IDEIntegration {
  constructor() {
    this.outputDir = './ide-integration';
    this.spinner = null;
  }

  async run() {
    console.log(chalk.blue.bold('\n🔧 IDE Integration Demo\n'));
    
    try {
      await this.demoVSCodeExtension();
      await this.demoCodeSnippets();
      await this.demoCommandPalette();
      await this.demoFileSystemOperations();
      
      console.log(chalk.green.bold('\n✅ IDE integration demo completed successfully!'));
      console.log(chalk.yellow(`📁 Generated files: ${this.outputDir}`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during IDE integration demo:'), error.message);
    }
  }

  async demoVSCodeExtension() {
    console.log(chalk.cyan.bold('\n📦 VS Code Extension Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'extensionName',
        message: 'Enter extension name:',
        default: 'code-generator',
        validate: (input) => {
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return 'Extension name must be lowercase with hyphens only';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Enter display name:',
        default: 'Code Generator'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter extension description:',
        default: 'Generate code from templates'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Enter author name:',
        default: 'Your Name'
      }
    ]);

    this.spinner = ora('Generating VS Code extension...').start();
    
    const extensionDir = path.join(this.outputDir, 'vscode-extension', answers.extensionName);
    await fs.ensureDir(extensionDir);
    
    // Generate VS Code extension files
    await this.generateVSCodeExtension(answers, extensionDir);
    
    this.spinner.succeed(`VS Code extension generated: ${answers.extensionName}`);
  }

  async generateVSCodeExtension(config, extensionDir) {
    const files = {
      'package.json': this.generatePackageJson(config),
      'extension.js': this.generateExtensionJS(config),
      'README.md': this.generateExtensionReadme(config),
      '.vscodeignore': this.generateVSCodeIgnore(),
      'snippets/snippets.json': this.generateSnippetsJson()
    };

    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(extensionDir, filename);
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content);
    }
  }

  async demoCodeSnippets() {
    console.log(chalk.cyan.bold('\n📝 Code Snippets Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Choose language for snippets:',
        choices: ['javascript', 'typescript', 'react', 'python', 'all'],
        default: 'all'
      },
      {
        type: 'confirm',
        name: 'includeCommon',
        message: 'Include common patterns?',
        default: true
      }
    ]);

    this.spinner = ora('Generating code snippets...').start();
    
    const snippetsDir = path.join(this.outputDir, 'snippets');
    await fs.ensureDir(snippetsDir);
    
    // Generate code snippets
    await this.generateCodeSnippets(answers, snippetsDir);
    
    this.spinner.succeed('Code snippets generated');
  }

  async generateCodeSnippets(config, snippetsDir) {
    const languages = config.language === 'all' 
      ? ['javascript', 'typescript', 'react', 'python']
      : [config.language];

    for (const language of languages) {
      const snippets = this.getSnippetsForLanguage(language, config.includeCommon);
      const filename = `${language}.json`;
      await fs.writeFile(path.join(snippetsDir, filename), JSON.stringify(snippets, null, 2));
    }
  }

  async demoCommandPalette() {
    console.log(chalk.cyan.bold('\n⌨️  Command Palette Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'commandName',
        message: 'Enter command name:',
        default: 'generateComponent'
      },
      {
        type: 'input',
        name: 'commandTitle',
        message: 'Enter command title:',
        default: 'Generate React Component'
      },
      {
        type: 'list',
        name: 'commandType',
        message: 'Choose command type:',
        choices: ['component', 'service', 'test', 'custom'],
        default: 'component'
      }
    ]);

    this.spinner = ora('Generating command palette integration...').start();
    
    const commandsDir = path.join(this.outputDir, 'commands');
    await fs.ensureDir(commandsDir);
    
    // Generate command palette files
    await this.generateCommandPalette(answers, commandsDir);
    
    this.spinner.succeed('Command palette integration generated');
  }

  async generateCommandPalette(config, commandsDir) {
    const files = {
      'commands.js': this.generateCommandsJS(config),
      'package.json': this.generateCommandsPackageJson(config),
      'README.md': this.generateCommandsReadme(config)
    };

    for (const [filename, content] of Object.entries(files)) {
      await fs.writeFile(path.join(commandsDir, filename), content);
    }
  }

  async demoFileSystemOperations() {
    console.log(chalk.cyan.bold('\n📁 File System Operations Demo'));
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'operationType',
        message: 'Choose operation type:',
        choices: ['create', 'read', 'update', 'delete', 'all'],
        default: 'all'
      },
      {
        type: 'confirm',
        name: 'withWatchers',
        message: 'Include file watchers?',
        default: true
      }
    ]);

    this.spinner = ora('Generating file system operations...').start();
    
    const fsDir = path.join(this.outputDir, 'file-system');
    await fs.ensureDir(fsDir);
    
    // Generate file system operations
    await this.generateFileSystemOperations(answers, fsDir);
    
    this.spinner.succeed('File system operations generated');
  }

  async generateFileSystemOperations(config, fsDir) {
    const files = {
      'operations.js': this.generateFileSystemOperationsJS(config),
      'watchers.js': config.withWatchers ? this.generateFileWatchersJS(config) : null,
      'utils.js': this.generateFileSystemUtilsJS(config)
    };

    for (const [filename, content] of Object.entries(files)) {
      if (content) {
        await fs.writeFile(path.join(fsDir, filename), content);
      }
    }
  }

  // Template generation methods
  generatePackageJson(config) {
    return JSON.stringify({
      name: config.extensionName,
      displayName: config.displayName,
      description: config.description,
      version: "1.0.0",
      publisher: config.author,
      engines: {
        "vscode": "^1.60.0"
      },
      categories: [
        "Other"
      ],
      activationEvents: [
        "onCommand:extension.generateComponent",
        "onCommand:extension.generateService",
        "onCommand:extension.generateTest"
      ],
      main: "./extension.js",
      contributes: {
        commands: [
          {
            command: "extension.generateComponent",
            title: "Generate React Component"
          },
          {
            command: "extension.generateService",
            title: "Generate Service"
          },
          {
            command: "extension.generateTest",
            title: "Generate Test"
          }
        ],
        snippets: [
          {
            language: "javascript",
            path: "./snippets/snippets.json"
          },
          {
            language: "typescript",
            path: "./snippets/snippets.json"
          },
          {
            language: "javascriptreact",
            path: "./snippets/snippets.json"
          }
        ]
      },
      scripts: {
        "lint": "eslint .",
        "pretest": "npm run lint",
        "test": "node ./test/runTest.js"
      },
      devDependencies: {
        "@types/vscode": "^1.60.0",
        "@types/node": "^14.14.37",
        "eslint": "^7.32.0"
      }
    }, null, 2);
  }

  generateExtensionJS(config) {
    return `const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
  console.log('Congratulations, your extension "${config.extensionName}" is now active!');

  // Register commands
  let generateComponent = vscode.commands.registerCommand('extension.generateComponent', async () => {
    const name = await vscode.window.showInputBox({
      prompt: 'Enter component name'
    });
    
    if (name) {
      await generateReactComponent(name);
    }
  });

  let generateService = vscode.commands.registerCommand('extension.generateService', async () => {
    const name = await vscode.window.showInputBox({
      prompt: 'Enter service name'
    });
    
    if (name) {
      await generateServiceFile(name);
    }
  });

  let generateTest = vscode.commands.registerCommand('extension.generateTest', async () => {
    const name = await vscode.window.showInputBox({
      prompt: 'Enter test name'
    });
    
    if (name) {
      await generateTestFile(name);
    }
  });

  context.subscriptions.push(generateComponent, generateService, generateTest);
}

async function generateReactComponent(name) {
  const componentTemplate = \`import React from 'react';
import PropTypes from 'prop-types';

const \${name} = ({ children }) => {
  return (
    <div className="\${name.toLowerCase()}">
      {children}
    </div>
  );
};

\${name}.propTypes = {
  children: PropTypes.node
};

export default \${name};\`;

  const document = await vscode.workspace.openTextDocument({
    content: componentTemplate,
    language: 'javascript'
  });
  
  await vscode.window.showTextDocument(document);
}

async function generateServiceFile(name) {
  const serviceTemplate = \`class \${name}Service {
  constructor() {
    this.baseUrl = process.env.API_URL || 'http://localhost:3000/api';
  }

  async getAll() {
    try {
      const response = await fetch(\`\${this.baseUrl}/\${name.toLowerCase()}s\`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching \${name.toLowerCase()}s:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await fetch(\`\${this.baseUrl}/\${name.toLowerCase()}s/\${id}\`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching \${name.toLowerCase()}:', error);
      throw error;
    }
  }
}

export default new \${name}Service();\`;

  const document = await vscode.workspace.openTextDocument({
    content: serviceTemplate,
    language: 'javascript'
  });
  
  await vscode.window.showTextDocument(document);
}

async function generateTestFile(name) {
  const testTemplate = \`import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import \${name} from './\${name}';

describe('\${name}', () => {
  it('renders without crashing', () => {
    render(<\${name}>Test Content</\${name}>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('has correct CSS class', () => {
    render(<\${name}>Test Content</\${name}>);
    expect(screen.getByText('Test Content').parentElement).toHaveClass('\${name.toLowerCase()}');
  });
});\`;

  const document = await vscode.workspace.openTextDocument({
    content: testTemplate,
    language: 'javascript'
  });
  
  await vscode.window.showTextDocument(document);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}`;
  }

  generateExtensionReadme(config) {
    return `# ${config.displayName}

${config.description}

## Features

- Generate React components with PropTypes
- Generate service classes with API methods
- Generate test files with Jest and React Testing Library
- Code snippets for common patterns

## Usage

### Commands

- \`Generate React Component\`: Creates a new React component
- \`Generate Service\`: Creates a new service class
- \`Generate Test\`: Creates a new test file

### Snippets

The extension provides useful code snippets:

- \`rfc\`: React functional component
- \`rcc\`: React class component
- \`rsc\`: React styled component
- \`test\`: Jest test template
- \`desc\`: Describe block
- \`it\`: Test case

## Installation

1. Install the extension from the VS Code marketplace
2. Restart VS Code
3. Use the command palette (Ctrl+Shift+P) to access commands

## Configuration

No additional configuration required.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License`;
  }

  generateVSCodeIgnore() {
    return `node_modules
.vscode-test
*.vsix
.DS_Store
*.log`;
  }

  generateSnippetsJson() {
    return JSON.stringify({
      "React Functional Component": {
        "prefix": "rfc",
        "body": [
          "import React from 'react';",
          "import PropTypes from 'prop-types';",
          "",
          "const ${1:ComponentName} = ({ ${2:props} }) => {",
          "  return (",
          "    <div className=\"${1:ComponentName.toLowerCase()}\">",
          "      $0",
          "    </div>",
          "  );",
          "};",
          "",
          "${1:ComponentName}.propTypes = {",
          "  ${2:props}: PropTypes.node",
          "};",
          "",
          "export default ${1:ComponentName};"
        ],
        "description": "Create a React functional component"
      },
      "React Class Component": {
        "prefix": "rcc",
        "body": [
          "import React, { Component } from 'react';",
          "import PropTypes from 'prop-types';",
          "",
          "class ${1:ComponentName} extends Component {",
          "  constructor(props) {",
          "    super(props);",
          "    this.state = {",
          "      $0",
          "    };",
          "  }",
          "",
          "  render() {",
          "    return (",
          "      <div className=\"${1:ComponentName.toLowerCase()}\">",
          "        ",
          "      </div>",
          "    );",
          "  }",
          "}",
          "",
          "${1:ComponentName}.propTypes = {",
          "  ",
          "};",
          "",
          "export default ${1:ComponentName};"
        ],
        "description": "Create a React class component"
      },
      "Jest Test": {
        "prefix": "test",
        "body": [
          "import React from 'react';",
          "import { render, screen } from '@testing-library/react';",
          "import '@testing-library/jest-dom';",
          "import ${1:ComponentName} from './${1:ComponentName}';",
          "",
          "describe('${1:ComponentName}', () => {",
          "  it('${2:should render correctly}', () => {",
          "    render(<${1:ComponentName} />);",
          "    $0",
          "  });",
          "});"
        ],
        "description": "Create a Jest test"
      }
    }, null, 2);
  }

  getSnippetsForLanguage(language, includeCommon) {
    const snippets = {};

    if (language === 'javascript' || language === 'typescript') {
      Object.assign(snippets, {
        "Function": {
          "prefix": "func",
          "body": [
            "function ${1:functionName}(${2:params}) {",
            "  $0",
            "}"
          ],
          "description": "Create a function"
        },
        "Arrow Function": {
          "prefix": "arrow",
          "body": [
            "const ${1:functionName} = (${2:params}) => {",
            "  $0",
            "};"
          ],
          "description": "Create an arrow function"
        },
        "Class": {
          "prefix": "class",
          "body": [
            "class ${1:ClassName} {",
            "  constructor(${2:params}) {",
            "    $0",
            "  }",
            "}"
          ],
          "description": "Create a class"
        }
      });
    }

    if (language === 'react' || language === 'javascriptreact') {
      Object.assign(snippets, {
        "React Hook": {
          "prefix": "hook",
          "body": [
            "import { useState, useEffect } from 'react';",
            "",
            "const use${1:HookName} = (${2:params}) => {",
            "  const [state, setState] = useState(${3:initialState});",
            "",
            "  useEffect(() => {",
            "    $0",
            "  }, [${4:dependencies}]);",
            "",
            "  return { state, setState };",
            "};",
            "",
            "export default use${1:HookName};"
          ],
          "description": "Create a React hook"
        }
      });
    }

    if (language === 'python') {
      Object.assign(snippets, {
        "Function": {
          "prefix": "def",
          "body": [
            "def ${1:function_name}(${2:params}):",
            "    $0",
            "    pass"
          ],
          "description": "Create a Python function"
        },
        "Class": {
          "prefix": "class",
          "body": [
            "class ${1:ClassName}:",
            "    def __init__(self, ${2:params}):",
            "        $0",
            "        pass"
          ],
          "description": "Create a Python class"
        }
      });
    }

    if (includeCommon) {
      Object.assign(snippets, {
        "Console Log": {
          "prefix": "log",
          "body": [
            "console.log('${1:message}', ${2:data});"
          ],
          "description": "Console log statement"
        },
        "Try Catch": {
          "prefix": "try",
          "body": [
            "try {",
            "  $1",
            "} catch (error) {",
            "  console.error('Error:', error);",
            "  $0",
            "}"
          ],
          "description": "Try catch block"
        }
      });
    }

    return snippets;
  }

  generateCommandsJS(config) {
    return `const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

// Command registration
function registerCommands(context) {
  const commands = [
    vscode.commands.registerCommand('${config.commandName}', async () => {
      await execute${this.toPascalCase(config.commandName)}();
    }),
    vscode.commands.registerCommand('${config.commandName}.withInput', async () => {
      await execute${this.toPascalCase(config.commandName)}WithInput();
    })
  ];

  context.subscriptions.push(...commands);
}

// Command implementations
async function execute${this.toPascalCase(config.commandName)}() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  const document = editor.document;
  const position = editor.selection.active;
  
  try {
    const generatedCode = await generate${this.toPascalCase(config.commandType)}();
    
    await editor.edit(editBuilder => {
      editBuilder.insert(position, generatedCode);
    });
    
    vscode.window.showInformationMessage('${config.commandTitle} generated successfully');
  } catch (error) {
    vscode.window.showErrorMessage(\`Error generating ${config.commandType}: \${error.message}\`);
  }
}

async function execute${this.toPascalCase(config.commandName)}WithInput() {
  const name = await vscode.window.showInputBox({
    prompt: 'Enter ${config.commandType} name',
    placeHolder: 'My${this.toPascalCase(config.commandType)}'
  });

  if (!name) {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor');
    return;
  }

  const position = editor.selection.active;
  
  try {
    const generatedCode = await generate${this.toPascalCase(config.commandType)}WithName(name);
    
    await editor.edit(editBuilder => {
      editBuilder.insert(position, generatedCode);
    });
    
    vscode.window.showInformationMessage(\`${config.commandTitle} '\${name}' generated successfully\`);
  } catch (error) {
    vscode.window.showErrorMessage(\`Error generating ${config.commandType}: \${error.message}\`);
  }
}

// Code generation functions
async function generate${this.toPascalCase(config.commandType)}() {
  return \`// Generated ${config.commandType}
// TODO: Implement your ${config.commandType} logic here
\`;
}

async function generate${this.toPascalCase(config.commandType)}WithName(name) {
  return \`// Generated ${config.commandType}: \${name}
class \${name} {
  constructor() {
    // Initialize your ${config.commandType}
  }

  // Add your methods here
}

export default \${name};
\`;
}

module.exports = {
  registerCommands
};`;
  }

  generateCommandsPackageJson(config) {
    return JSON.stringify({
      name: `${config.commandName}-commands`,
      version: "1.0.0",
      description: `Commands for ${config.commandTitle}`,
      main: "commands.js",
      scripts: {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      keywords: [
        "vscode",
        "extension",
        "commands",
        "code-generation"
      ],
      author: "Your Name",
      license: "MIT",
      dependencies: {
        "vscode": "^1.60.0"
      }
    }, null, 2);
  }

  generateCommandsReadme(config) {
    return `# ${config.commandTitle} Commands

This package provides VS Code commands for ${config.commandTitle}.

## Commands

- \`${config.commandName}\`: ${config.commandTitle}
- \`${config.commandName}.withInput\`: ${config.commandTitle} with user input

## Usage

1. Install the package
2. Use the command palette (Ctrl+Shift+P)
3. Search for "${config.commandTitle}"
4. Select the desired command

## Configuration

No additional configuration required.

## License

MIT License`;
  }

  generateFileSystemOperationsJS(config) {
    return `const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;

class FileSystemOperations {
  constructor() {
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  // Create file operation
  async createFile(filePath, content) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, filePath);
      await fs.writeFile(fullPath, content, 'utf8');
      vscode.window.showInformationMessage(\`File created: \${filePath}\`);
      return fullPath;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error creating file: \${error.message}\`);
      throw error;
    }
  }

  // Read file operation
  async readFile(filePath) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      return content;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error reading file: \${error.message}\`);
      throw error;
    }
  }

  // Update file operation
  async updateFile(filePath, content) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, filePath);
      await fs.writeFile(fullPath, content, 'utf8');
      vscode.window.showInformationMessage(\`File updated: \${filePath}\`);
      return fullPath;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error updating file: \${error.message}\`);
      throw error;
    }
  }

  // Delete file operation
  async deleteFile(filePath) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, filePath);
      await fs.unlink(fullPath);
      vscode.window.showInformationMessage(\`File deleted: \${filePath}\`);
      return true;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error deleting file: \${error.message}\`);
      throw error;
    }
  }

  // Create directory operation
  async createDirectory(dirPath) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, dirPath);
      await fs.mkdir(fullPath, { recursive: true });
      vscode.window.showInformationMessage(\`Directory created: \${dirPath}\`);
      return fullPath;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error creating directory: \${error.message}\`);
      throw error;
    }
  }

  // List files operation
  async listFiles(dirPath = '.') {
    try {
      const fullPath = path.resolve(this.workspaceRoot, dirPath);
      const files = await fs.readdir(fullPath);
      return files;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error listing files: \${error.message}\`);
      throw error;
    }
  }

  // Check if file exists
  async fileExists(filePath) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  // Get file stats
  async getFileStats(filePath) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, filePath);
      const stats = await fs.stat(fullPath);
      return stats;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error getting file stats: \${error.message}\`);
      throw error;
    }
  }
}

module.exports = FileSystemOperations;`;
  }

  generateFileWatchersJS(config) {
    return `const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

class FileWatchers {
  constructor() {
    this.watchers = new Map();
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  // Watch file for changes
  watchFile(filePath, callback) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, filePath);
      const watcher = fs.watch(fullPath, (eventType, filename) => {
        callback(eventType, filename, fullPath);
      });

      this.watchers.set(filePath, watcher);
      vscode.window.showInformationMessage(\`Watching file: \${filePath}\`);
      
      return watcher;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error watching file: \${error.message}\`);
      throw error;
    }
  }

  // Watch directory for changes
  watchDirectory(dirPath, callback) {
    try {
      const fullPath = path.resolve(this.workspaceRoot, dirPath);
      const watcher = fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
        callback(eventType, filename, fullPath);
      });

      this.watchers.set(dirPath, watcher);
      vscode.window.showInformationMessage(\`Watching directory: \${dirPath}\`);
      
      return watcher;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error watching directory: \${error.message}\`);
      throw error;
    }
  }

  // Stop watching a specific path
  stopWatching(watchPath) {
    const watcher = this.watchers.get(watchPath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(watchPath);
      vscode.window.showInformationMessage(\`Stopped watching: \${watchPath}\`);
      return true;
    }
    return false;
  }

  // Stop all watchers
  stopAllWatchers() {
    for (const [path, watcher] of this.watchers) {
      watcher.close();
    }
    this.watchers.clear();
    vscode.window.showInformationMessage('Stopped all file watchers');
  }

  // Get list of watched paths
  getWatchedPaths() {
    return Array.from(this.watchers.keys());
  }

  // Watch for specific file types
  watchFileTypes(directory, fileTypes, callback) {
    const fileTypeRegex = new RegExp(\`\\\\.(\${fileTypes.join('|')})$\\`);
    
    return this.watchDirectory(directory, (eventType, filename) => {
      if (filename && fileTypeRegex.test(filename)) {
        callback(eventType, filename, path.join(directory, filename));
      }
    });
  }

  // Watch for template changes
  watchTemplates(callback) {
    return this.watchFileTypes('templates', ['hbs', 'ejs', 'pug'], callback);
  }

  // Watch for configuration changes
  watchConfig(callback) {
    return this.watchFileTypes('.', ['json', 'js', 'yaml', 'yml'], callback);
  }
}

module.exports = FileWatchers;`;
  }

  generateFileSystemUtilsJS(config) {
    return `const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;

class FileSystemUtils {
  constructor() {
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  // Get workspace root
  getWorkspaceRoot() {
    return this.workspaceRoot;
  }

  // Resolve path relative to workspace
  resolvePath(relativePath) {
    return path.resolve(this.workspaceRoot, relativePath);
  }

  // Get relative path from workspace
  getRelativePath(fullPath) {
    return path.relative(this.workspaceRoot, fullPath);
  }

  // Ensure directory exists
  async ensureDirectory(dirPath) {
    try {
      const fullPath = this.resolvePath(dirPath);
      await fs.mkdir(fullPath, { recursive: true });
      return fullPath;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error ensuring directory: \${error.message}\`);
      throw error;
    }
  }

  // Copy file
  async copyFile(source, destination) {
    try {
      const sourcePath = this.resolvePath(source);
      const destPath = this.resolvePath(destination);
      await fs.copyFile(sourcePath, destPath);
      vscode.window.showInformationMessage(\`File copied: \${source} -> \${destination}\`);
      return destPath;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error copying file: \${error.message}\`);
      throw error;
    }
  }

  // Move file
  async moveFile(source, destination) {
    try {
      const sourcePath = this.resolvePath(source);
      const destPath = this.resolvePath(destination);
      await fs.rename(sourcePath, destPath);
      vscode.window.showInformationMessage(\`File moved: \${source} -> \${destination}\`);
      return destPath;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error moving file: \${error.message}\`);
      throw error;
    }
  }

  // Find files by pattern
  async findFiles(pattern, exclude = '**/node_modules/**') {
    try {
      const files = await vscode.workspace.findFiles(pattern, exclude);
      return files.map(file => this.getRelativePath(file.fsPath));
    } catch (error) {
      vscode.window.showErrorMessage(\`Error finding files: \${error.message}\`);
      throw error;
    }
  }

  // Get file extension
  getFileExtension(filePath) {
    return path.extname(filePath);
  }

  // Get file name without extension
  getFileNameWithoutExtension(filePath) {
    return path.basename(filePath, path.extname(filePath));
  }

  // Get directory name
  getDirectoryName(filePath) {
    return path.dirname(filePath);
  }

  // Check if path is absolute
  isAbsolutePath(filePath) {
    return path.isAbsolute(filePath);
  }

  // Join paths
  joinPaths(...paths) {
    return path.join(...paths);
  }

  // Normalize path
  normalizePath(filePath) {
    return path.normalize(filePath);
  }

  // Get file size
  async getFileSize(filePath) {
    try {
      const fullPath = this.resolvePath(filePath);
      const stats = await fs.stat(fullPath);
      return stats.size;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error getting file size: \${error.message}\`);
      throw error;
    }
  }

  // Get file modification time
  async getFileModTime(filePath) {
    try {
      const fullPath = this.resolvePath(filePath);
      const stats = await fs.stat(fullPath);
      return stats.mtime;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error getting file modification time: \${error.message}\`);
      throw error;
    }
  }

  // Create backup of file
  async createBackup(filePath) {
    try {
      const backupPath = \`\${filePath}.backup\`;
      await this.copyFile(filePath, backupPath);
      return backupPath;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error creating backup: \${error.message}\`);
      throw error;
    }
  }

  // Restore file from backup
  async restoreFromBackup(filePath) {
    try {
      const backupPath = \`\${filePath}.backup\`;
      await this.copyFile(backupPath, filePath);
      return filePath;
    } catch (error) {
      vscode.window.showErrorMessage(\`Error restoring from backup: \${error.message}\`);
      throw error;
    }
  }
}

module.exports = FileSystemUtils;`;
  }

  // Helper utility methods
  toPascalCase(str) {
    return str.replace(/(^|_|-)([a-z])/g, (match, p1, p2) => p2.toUpperCase());
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new IDEIntegration();
  demo.run().catch(console.error);
}

module.exports = IDEIntegration;
