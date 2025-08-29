const chalk = require('chalk');
const ora = require('ora');
const Handlebars = require('handlebars');

/**
 * Testing Strategies Examples
 * Demonstrates unit testing, integration testing, and visual regression testing
 */
class TestingStrategies {
  constructor() {
    this.spinner = ora();
    this.testResults = [];
  }

  async run() {
    console.log(chalk.blue.bold('\n🧪 Testing Strategies Examples\n'));
    
    console.log(chalk.yellow('\n1. Unit Testing Templates'));
    await this.demoUnitTesting();
    
    console.log(chalk.yellow('\n2. Integration Testing'));
    await this.demoIntegrationTesting();
    
    console.log(chalk.yellow('\n3. Visual Regression Testing'));
    await this.demoVisualRegressionTesting();
    
    console.log(chalk.yellow('\n4. Test Utilities and Helpers'));
    await this.demoTestUtilities();
    
    console.log(chalk.green('\n✅ Testing strategies examples completed!'));
    this.printTestSummary();
  }

  async demoUnitTesting() {
    console.log(chalk.cyan('\n🔬 Unit Testing Demo'));
    
    const unitTester = new TemplateUnitTester();
    
    // Test user card template
    console.log('\nTesting User Card Template:');
    const userCardTests = [
      {
        name: 'renders user information correctly',
        template: `
          <div class="user-card">
            <h3>{{name}}</h3>
            <p>{{email}}</p>
            {{#if isAdmin}}
              <span class="admin-badge">Admin</span>
            {{/if}}
          </div>
        `,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          isAdmin: false
        },
        expectations: {
          contains: ['John Doe', 'john@example.com'],
          notContains: ['admin-badge']
        }
      },
      {
        name: 'shows admin badge for admin users',
        template: `
          <div class="user-card">
            <h3>{{name}}</h3>
            <p>{{email}}</p>
            {{#if isAdmin}}
              <span class="admin-badge">Admin</span>
            {{/if}}
          </div>
        `,
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          isAdmin: true
        },
        expectations: {
          contains: ['Admin User', 'admin@example.com', 'admin-badge']
        }
      }
    ];

    for (const test of userCardTests) {
      const result = unitTester.testTemplate(test);
      this.recordTestResult(test.name, result);
      console.log(`${result.passed ? '✅' : '❌'} ${test.name}`);
    }

    // Test product grid template
    console.log('\nTesting Product Grid Template:');
    const productGridTest = {
      name: 'renders product list correctly',
      template: `
        <div class="product-grid">
          {{#each products}}
            <div class="product-card">
              <h4>{{name}}</h4>
              <p class="price">${{price}}</p>
            </div>
          {{/each}}
        </div>
      `,
      data: {
        products: [
          { name: 'Product 1', price: 29.99 },
          { name: 'Product 2', price: 49.99 }
        ]
      },
      expectations: {
        contains: ['Product 1', 'Product 2', '$29.99', '$49.99'],
        count: {
          'product-card': 2
        }
      }
    };

    const result = unitTester.testTemplate(productGridTest);
    this.recordTestResult(productGridTest.name, result);
    console.log(`${result.passed ? '✅' : '❌'} ${productGridTest.name}`);
  }

  async demoIntegrationTesting() {
    console.log(chalk.cyan('\n🔗 Integration Testing Demo'));
    
    const integrationTester = new TemplateIntegrationTester();
    
    // Test template with data source integration
    console.log('\nTesting Template with Data Source:');
    const integrationTest = {
      name: 'user profile with database data',
      templateName: 'user-profile',
      dataSource: 'user-database',
      testData: {
        userId: 123,
        expectedFields: ['name', 'email', 'avatar', 'joinDate']
      },
      expectations: {
        requiredElements: ['user-profile', 'name', 'email'],
        forbiddenElements: ['script', 'iframe'],
        dataValidation: {
          name: (value) => typeof value === 'string' && value.length > 0,
          email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        }
      }
    };

    const result = await integrationTester.testTemplateRendering(integrationTest);
    this.recordTestResult(integrationTest.name, result);
    console.log(`${result.success ? '✅' : '❌'} ${integrationTest.name}`);
    
    if (!result.success) {
      console.log('Errors:', result.errors.join(', '));
    }

    // Test template with external API
    console.log('\nTesting Template with External API:');
    const apiTest = {
      name: 'product catalog with API data',
      templateName: 'product-catalog',
      dataSource: 'product-api',
      testData: {
        category: 'electronics',
        expectedCount: 5
      },
      expectations: {
        requiredElements: ['product-grid', 'product-card'],
        dataValidation: {
          products: (value) => Array.isArray(value) && value.length > 0,
          'products.*.name': (value) => typeof value === 'string' && value.length > 0,
          'products.*.price': (value) => typeof value === 'number' && value > 0
        }
      }
    };

    const apiResult = await integrationTester.testTemplateRendering(apiTest);
    this.recordTestResult(apiTest.name, apiResult);
    console.log(`${apiResult.success ? '✅' : '❌'} ${apiTest.name}`);
  }

  async demoVisualRegressionTesting() {
    console.log(chalk.cyan('\n👁️ Visual Regression Testing Demo'));
    
    const visualTester = new VisualRegressionTester();
    
    // Test template visual consistency
    console.log('\nTesting Template Visual Consistency:');
    const visualTests = [
      {
        name: 'user card template visual test',
        template: 'user-card',
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'avatar.jpg',
          isAdmin: false
        },
        viewport: { width: 400, height: 300 }
      },
      {
        name: 'product grid template visual test',
        template: 'product-grid',
        data: {
          products: [
            { name: 'Product 1', price: 29.99, image: 'product1.jpg' },
            { name: 'Product 2', price: 49.99, image: 'product2.jpg' }
          ]
        },
        viewport: { width: 800, height: 600 }
      }
    ];

    for (const test of visualTests) {
      console.log(`\nRunning visual test: ${test.name}`);
      
      // Simulate screenshot capture
      const baseline = await visualTester.captureScreenshot(test);
      console.log(`Baseline screenshot captured: ${baseline.width}x${baseline.height}`);
      
      // Simulate comparison with previous version
      const comparison = await visualTester.compareWithBaseline(test, baseline);
      console.log(`Visual comparison: ${comparison.isDifferent ? '❌ DIFFERENT' : '✅ IDENTICAL'}`);
      
      if (comparison.isDifferent) {
        console.log(`Difference percentage: ${comparison.difference.toFixed(2)}%`);
      }
    }
  }

  async demoTestUtilities() {
    console.log(chalk.cyan('\n🛠️ Test Utilities Demo'));
    
    const testUtils = new TemplateTestUtils();
    
    // Test template validation utilities
    console.log('\nTesting Template Validation Utilities:');
    
    const validationTests = [
      {
        name: 'validate template syntax',
        template: '<div>{{name}}</div>',
        expected: true
      },
      {
        name: 'detect missing closing tags',
        template: '<div>{{name}}<span>text',
        expected: false
      },
      {
        name: 'validate variable references',
        template: '<div>{{name}} {{undefined_var}}</div>',
        expected: false
      }
    ];

    for (const test of validationTests) {
      const isValid = testUtils.validateTemplateSyntax(test.template);
      const result = isValid === test.expected;
      this.recordTestResult(test.name, { passed: result });
      console.log(`${result ? '✅' : '❌'} ${test.name}`);
    }

    // Test data generation utilities
    console.log('\nTesting Data Generation Utilities:');
    
    const mockData = testUtils.generateMockData('user', {
      name: 'string',
      email: 'email',
      age: 'number',
      isAdmin: 'boolean'
    });

    console.log('Generated mock user data:', mockData);

    // Test performance benchmarking
    console.log('\nTesting Performance Benchmarking:');
    
    const benchmark = await testUtils.benchmarkTemplate('user-card', {
      iterations: 100,
      data: mockData
    });

    console.log(`Average render time: ${benchmark.average.toFixed(2)}ms`);
    console.log(`Min render time: ${benchmark.min.toFixed(2)}ms`);
    console.log(`Max render time: ${benchmark.max.toFixed(2)}ms`);
  }

  recordTestResult(testName, result) {
    this.testResults.push({
      name: testName,
      passed: result.passed || result.success,
      timestamp: new Date().toISOString()
    });
  }

  printTestSummary() {
    console.log(chalk.blue.bold('\n📊 Test Summary'));
    
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = total - passed;
    
    console.log(`Total tests: ${total}`);
    console.log(`Passed: ${chalk.green(passed)}`);
    console.log(`Failed: ${chalk.red(failed)}`);
    console.log(`Success rate: ${((passed / total) * 100).toFixed(1)}%`);
  }
}

/**
 * Template Unit Tester
 */
class TemplateUnitTester {
  testTemplate(test) {
    try {
      const template = Handlebars.compile(test.template);
      const result = template(test.data);
      
      const validation = this.validateResult(result, test.expectations);
      
      return {
        passed: validation.passed,
        errors: validation.errors,
        result: result.substring(0, 100) + '...'
      };
    } catch (error) {
      return {
        passed: false,
        errors: [error.message],
        result: null
      };
    }
  }

  validateResult(result, expectations) {
    const errors = [];
    
    // Check for required content
    if (expectations.contains) {
      for (const content of expectations.contains) {
        if (!result.includes(content)) {
          errors.push(`Missing required content: ${content}`);
        }
      }
    }
    
    // Check for forbidden content
    if (expectations.notContains) {
      for (const content of expectations.notContains) {
        if (result.includes(content)) {
          errors.push(`Contains forbidden content: ${content}`);
        }
      }
    }
    
    // Check element counts
    if (expectations.count) {
      for (const [element, expectedCount] of Object.entries(expectations.count)) {
        const actualCount = (result.match(new RegExp(element, 'g')) || []).length;
        if (actualCount !== expectedCount) {
          errors.push(`Expected ${expectedCount} ${element} elements, found ${actualCount}`);
        }
      }
    }
    
    return {
      passed: errors.length === 0,
      errors
    };
  }
}

/**
 * Template Integration Tester
 */
class TemplateIntegrationTester {
  async testTemplateRendering(test) {
    try {
      // Simulate data source integration
      const data = await this.getDataFromSource(test.dataSource, test.testData);
      
      // Simulate template rendering
      const result = await this.renderTemplate(test.templateName, data);
      
      // Validate output
      return this.validateOutput(result, test.expectations);
    } catch (error) {
      return {
        success: false,
        errors: [error.message]
      };
    }
  }

  async getDataFromSource(source, testData) {
    // Simulate data source responses
    const mockData = {
      'user-database': {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'avatar.jpg',
        joinDate: '2023-01-15'
      },
      'product-api': {
        products: [
          { name: 'Laptop', price: 999.99, image: 'laptop.jpg' },
          { name: 'Phone', price: 599.99, image: 'phone.jpg' },
          { name: 'Tablet', price: 399.99, image: 'tablet.jpg' }
        ]
      }
    };
    
    return mockData[source] || {};
  }

  async renderTemplate(templateName, data) {
    // Simulate template rendering
    const templates = {
      'user-profile': `
        <div class="user-profile">
          <h2>{{name}}</h2>
          <p>{{email}}</p>
          <p>Member since: {{joinDate}}</p>
        </div>
      `,
      'product-catalog': `
        <div class="product-grid">
          {{#each products}}
            <div class="product-card">
              <h4>{{name}}</h4>
              <p class="price">${{price}}</p>
            </div>
          {{/each}}
        </div>
      `
    };
    
    const template = Handlebars.compile(templates[templateName] || '');
    return template(data);
  }

  validateOutput(result, expectations) {
    const errors = [];
    
    // Check for required elements
    for (const element of expectations.requiredElements) {
      if (!result.includes(element)) {
        errors.push(`Missing required element: ${element}`);
      }
    }
    
    // Check for forbidden elements
    for (const element of expectations.forbiddenElements || []) {
      if (result.includes(element)) {
        errors.push(`Forbidden element found: ${element}`);
      }
    }
    
    return {
      success: errors.length === 0,
      errors
    };
  }
}

/**
 * Visual Regression Tester
 */
class VisualRegressionTester {
  async captureScreenshot(test) {
    // Simulate screenshot capture
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      width: test.viewport.width,
      height: test.viewport.height,
      data: `screenshot_${Date.now()}.png`
    };
  }

  async compareWithBaseline(test, baseline) {
    // Simulate visual comparison
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Simulate random differences for demo
    const isDifferent = Math.random() > 0.8;
    const difference = isDifferent ? Math.random() * 5 : 0;
    
    return {
      isDifferent,
      difference,
      diffImage: isDifferent ? `diff_${Date.now()}.png` : null
    };
  }
}

/**
 * Template Test Utilities
 */
class TemplateTestUtils {
  validateTemplateSyntax(template) {
    try {
      Handlebars.compile(template);
      return true;
    } catch (error) {
      return false;
    }
  }

  generateMockData(type, schema) {
    const mockGenerators = {
      string: () => 'Mock String',
      email: () => 'mock@example.com',
      number: () => Math.floor(Math.random() * 100),
      boolean: () => Math.random() > 0.5,
      date: () => new Date().toISOString().split('T')[0]
    };
    
    const data = {};
    for (const [field, type] of Object.entries(schema)) {
      data[field] = mockGenerators[type]();
    }
    
    return data;
  }

  async benchmarkTemplate(templateName, options) {
    const template = Handlebars.compile('<div>{{name}}</div>');
    const data = options.data;
    
    const times = [];
    for (let i = 0; i < options.iterations; i++) {
      const start = process.hrtime.bigint();
      template(data);
      const end = process.hrtime.bigint();
      times.push(Number(end - start) / 1000000);
    }
    
    const sorted = times.sort((a, b) => a - b);
    const avg = times.reduce((sum, val) => sum + val, 0) / times.length;
    
    return {
      average: avg,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)]
    };
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new TestingStrategies();
  demo.run().catch(console.error);
}

module.exports = {
  TestingStrategies,
  TemplateUnitTester,
  TemplateIntegrationTester,
  VisualRegressionTester,
  TemplateTestUtils
};
