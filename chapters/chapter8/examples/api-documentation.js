const chalk = require('chalk');
const ora = require('ora');

/**
 * API Documentation Generator
 * Demonstrates automated API documentation generation with OpenAPI parsing and code examples
 */
class APIDocumentationGenerator {
  constructor() {
    this.spinner = ora();
    this.openAPIParser = new OpenAPIParser();
    this.templateEngine = new Handlebars();
    this.codeGenerator = new CodeExampleGenerator();
    this.versionManager = new VersionManager();
  }

  async run() {
    console.log(chalk.blue.bold('\n📚 API Documentation Generator\n'));
    
    console.log(chalk.yellow('\n1. OpenAPI Specification Parsing'));
    await this.demoOpenAPIParsing();
    
    console.log(chalk.yellow('\n2. Multi-language Code Examples'));
    await this.demoCodeExamples();
    
    console.log(chalk.yellow('\n3. Interactive Documentation'));
    await this.demoInteractiveDocs();
    
    console.log(chalk.yellow('\n4. Version Management'));
    await this.demoVersionManagement();
    
    console.log(chalk.yellow('\n5. Custom Branding'));
    await this.demoCustomBranding();
    
    console.log(chalk.green('\n✅ API documentation examples completed!'));
  }

  async demoOpenAPIParsing() {
    console.log(chalk.cyan('\n🔍 OpenAPI Specification Parsing Demo'));
    
    const openAPISpec = {
      openapi: '3.0.0',
      info: {
        title: 'User Management API',
        version: '1.0.0',
        description: 'API for managing users'
      },
      paths: {
        '/users': {
          get: {
            summary: 'Get all users',
            responses: {
              '200': {
                description: 'List of users',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          },
          post: {
            summary: 'Create a new user',
            requestBody: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          }
        }
      }
    };

    console.log('Parsing OpenAPI specification...');
    const parsedSpec = await this.openAPIParser.parse(openAPISpec);
    
    console.log('Parsed Specification:');
    console.log(`  - API Title: ${parsedSpec.info.title}`);
    console.log(`  - Version: ${parsedSpec.info.version}`);
    console.log(`  - Endpoints: ${parsedSpec.endpoints.length}`);
    console.log(`  - Schemas: ${parsedSpec.schemas.length}`);
    console.log(`  - Security: ${parsedSpec.security ? 'Configured' : 'None'}`);
  }

  async demoCodeExamples() {
    console.log(chalk.cyan('\n💻 Multi-language Code Examples Demo'));
    
    const languages = ['javascript', 'python', 'curl', 'java'];
    const endpoint = {
      method: 'POST',
      path: '/users',
      summary: 'Create a new user',
      parameters: [
        { name: 'name', type: 'string', required: true },
        { name: 'email', type: 'string', required: true }
      ]
    };

    for (const language of languages) {
      console.log(`\nGenerating ${language.toUpperCase()} example:`);
      
      const codeExample = await this.codeGenerator.generateExample(endpoint, language);
      
      console.log('Generated Code:');
      console.log(`  - Language: ${codeExample.language}`);
      console.log(`  - Lines: ${codeExample.lines}`);
      console.log(`  - Syntax Highlighted: ${codeExample.syntaxHighlighted ? 'Yes' : 'No'}`);
      console.log(`  - Code Preview: ${codeExample.code.substring(0, 100)}...`);
    }
  }

  async demoInteractiveDocs() {
    console.log(chalk.cyan('\n🎮 Interactive Documentation Demo'));
    
    const interactiveFeatures = [
      'Try It Out',
      'Request Builder',
      'Response Viewer',
      'Authentication Helper'
    ];

    for (const feature of interactiveFeatures) {
      console.log(`\nImplementing: ${feature}`);
      
      const implementation = await this.implementInteractiveFeature(feature);
      
      console.log('Implementation Results:');
      console.log(`  - Status: ${implementation.status}`);
      console.log(`  - Complexity: ${implementation.complexity}`);
      console.log(`  - User Experience: ${implementation.userExperience}/10`);
    }
  }

  async demoVersionManagement() {
    console.log(chalk.cyan('\n📋 Version Management Demo'));
    
    const versions = ['1.0.0', '1.1.0', '2.0.0'];
    
    for (const version of versions) {
      console.log(`\nManaging version: ${version}`);
      
      const versionInfo = await this.versionManager.createVersion(version);
      
      console.log('Version Information:');
      console.log(`  - Version ID: ${versionInfo.versionId}`);
      console.log(`  - Release Date: ${versionInfo.releaseDate}`);
      console.log(`  - Breaking Changes: ${versionInfo.breakingChanges ? 'Yes' : 'No'}`);
      console.log(`  - Deprecated Endpoints: ${versionInfo.deprecatedEndpoints.length}`);
    }
  }

  async demoCustomBranding() {
    console.log(chalk.cyan('\n🎨 Custom Branding Demo'));
    
    const brandingConfig = {
      companyName: 'TechCorp API',
      logo: 'https://example.com/logo.png',
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      fontFamily: 'Inter, sans-serif'
    };

    console.log('Applying custom branding...');
    const brandedDocs = await this.applyCustomBranding(brandingConfig);
    
    console.log('Branding Applied:');
    console.log(`  - Company Name: ${brandedDocs.companyName}`);
    console.log(`  - Logo: ${brandedDocs.logo ? 'Applied' : 'Not Applied'}`);
    console.log(`  - Color Scheme: ${brandedDocs.colorScheme}`);
    console.log(`  - Typography: ${brandedDocs.typography}`);
    console.log(`  - Custom CSS: ${brandedDocs.customCSS ? 'Generated' : 'Not Generated'}`);
  }
}

// Supporting classes
class OpenAPIParser {
  async parse(spec) {
    return {
      info: spec.info,
      endpoints: Object.keys(spec.paths).map(path => ({
        path,
        methods: Object.keys(spec.paths[path])
      })),
      schemas: Object.keys(spec.components?.schemas || {}),
      security: !!spec.security
    };
  }
}

class Handlebars {
  async render(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || '');
  }
}

class CodeExampleGenerator {
  async generateExample(endpoint, language) {
    const examples = {
      javascript: `fetch('/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})`,
      python: `import requests
response = requests.post('/users', json={'name': 'John', 'email': 'john@example.com'})`,
      curl: `curl -X POST /users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John", "email": "john@example.com"}'`,
      java: `HttpResponse<String> response = Unirest.post("/users")
  .header("Content-Type", "application/json")
  .body("{\"name\":\"John\",\"email\":\"john@example.com\"}")
  .asString();`
    };

    return {
      language,
      code: examples[language] || examples.javascript,
      lines: (examples[language] || examples.javascript).split('\n').length,
      syntaxHighlighted: true
    };
  }
}

class VersionManager {
  async createVersion(version) {
    return {
      versionId: `v${version}`,
      releaseDate: new Date().toISOString(),
      breakingChanges: version.startsWith('2'),
      deprecatedEndpoints: version.startsWith('2') ? ['/old-endpoint'] : []
    };
  }
}

// API Documentation Generator Methods
APIDocumentationGenerator.prototype.implementInteractiveFeature = async function(feature) {
  return {
    status: 'implemented',
    complexity: Math.round(Math.random() * 5 + 3),
    userExperience: Math.round(Math.random() * 3 + 7)
  };
};

APIDocumentationGenerator.prototype.applyCustomBranding = async function(config) {
  return {
    companyName: config.companyName,
    logo: true,
    colorScheme: `${config.primaryColor}, ${config.secondaryColor}`,
    typography: config.fontFamily,
    customCSS: true
  };
};

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new APIDocumentationGenerator();
  demo.run().catch(console.error);
}

module.exports = { APIDocumentationGenerator };
