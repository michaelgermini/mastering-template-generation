const chalk = require('chalk');
const ora = require('ora');

/**
 * Security Best Practices Examples
 * Demonstrates input validation, sanitization, CSP, and injection prevention
 */
class SecurityPractices {
  constructor() {
    this.spinner = ora();
    this.securityEngine = new SecureTemplateEngine();
    this.templateManager = new SecureTemplateManager();
  }

  async run() {
    console.log(chalk.blue.bold('\n🔒 Security Best Practices Examples\n'));
    
    console.log(chalk.yellow('\n1. Input Validation and Sanitization'));
    await this.demoInputValidation();
    
    console.log(chalk.yellow('\n2. Content Security Policy'));
    await this.demoCSP();
    
    console.log(chalk.yellow('\n3. Template Injection Prevention'));
    await this.demoInjectionPrevention();
    
    console.log(chalk.yellow('\n4. Secure Template Management'));
    await this.demoSecureManagement();
    
    console.log(chalk.green('\n✅ Security practices examples completed!'));
  }

  async demoInputValidation() {
    console.log(chalk.cyan('\n🛡️ Input Validation Demo'));
    
    // Define validation schemas
    const userSchema = {
      name: (value) => typeof value === 'string' && value.length > 0 && value.length <= 100,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      age: (value) => Number.isInteger(value) && value >= 0 && value <= 120,
      isAdmin: (value) => typeof value === 'boolean'
    };

    const productSchema = {
      name: (value) => typeof value === 'string' && value.length > 0 && value.length <= 200,
      price: (value) => typeof value === 'number' && value >= 0,
      category: (value) => ['electronics', 'clothing', 'books'].includes(value)
    };

    // Test valid data
    console.log('\nTesting valid data:');
    const validUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      isAdmin: false
    };

    try {
      this.securityEngine.validate(validUserData, userSchema);
      console.log('✅ Valid user data passed validation');
    } catch (error) {
      console.log('❌ Validation failed:', error.message);
    }

    // Test invalid data
    console.log('\nTesting invalid data:');
    const invalidUserData = {
      name: '', // Empty name
      email: 'invalid-email', // Invalid email
      age: 150, // Invalid age
      isAdmin: 'yes' // Wrong type
    };

    try {
      this.securityEngine.validate(invalidUserData, userSchema);
      console.log('❌ Invalid data should have failed validation');
    } catch (error) {
      console.log('✅ Invalid data correctly rejected:', error.message);
    }

    // Test sanitization
    console.log('\nTesting data sanitization:');
    const dirtyData = {
      name: '<script>alert("XSS")</script>John Doe',
      email: 'john@example.com',
      bio: '<img src="x" onerror="alert(\'XSS\')">Bio text',
      website: 'javascript:alert("XSS")'
    };

    const sanitizedData = this.securityEngine.sanitize(dirtyData);
    console.log('Original data:', dirtyData.name);
    console.log('Sanitized data:', sanitizedData.name);
  }

  async demoCSP() {
    console.log(chalk.cyan('\n🛡️ Content Security Policy Demo'));
    
    const cspManager = new CSPManager();
    
    // Generate CSP headers for different environments
    const environments = ['development', 'staging', 'production'];
    
    for (const env of environments) {
      const csp = cspManager.generateCSP(env);
      console.log(`\n${env.toUpperCase()} CSP:`);
      console.log(csp);
    }

    // Test CSP violation detection
    console.log('\nTesting CSP violation detection:');
    const violations = [
      'inline script execution',
      'eval() function call',
      'external resource loading',
      'unsafe inline styles'
    ];

    for (const violation of violations) {
      const isBlocked = cspManager.checkViolation(violation, 'production');
      console.log(`${violation}: ${isBlocked ? '🚫 BLOCKED' : '✅ ALLOWED'}`);
    }
  }

  async demoInjectionPrevention() {
    console.log(chalk.cyan('\n🛡️ Template Injection Prevention Demo'));
    
    // Register safe templates
    this.templateManager.registerTemplate('user-profile', `
      <div class="user-profile">
        <h2>{{name}}</h2>
        <p>{{email}}</p>
        <p>Member since: {{joinDate}}</p>
      </div>
    `);

    this.templateManager.registerTemplate('product-card', `
      <div class="product-card">
        <h3>{{name}}</h3>
        <p class="price">${{price}}</p>
        <p>{{description}}</p>
      </div>
    `);

    // Test safe template rendering
    console.log('\nTesting safe template rendering:');
    try {
      const result = this.templateManager.render('user-profile', {
        name: 'John Doe',
        email: 'john@example.com',
        joinDate: '2023-01-15'
      });
      console.log('✅ Safe template rendered successfully');
      console.log('Result:', result.substring(0, 50) + '...');
    } catch (error) {
      console.log('❌ Safe template failed:', error.message);
    }

    // Test malicious template injection attempt
    console.log('\nTesting malicious template injection:');
    const maliciousTemplate = `
      <div>{{name}}</div>
      <script>eval('alert("XSS")')</script>
    `;

    try {
      this.templateManager.registerTemplate('malicious', maliciousTemplate);
      console.log('❌ Malicious template should have been rejected');
    } catch (error) {
      console.log('✅ Malicious template correctly rejected:', error.message);
    }

    // Test unauthorized template access
    console.log('\nTesting unauthorized template access:');
    try {
      this.templateManager.render('unauthorized-template', {});
      console.log('❌ Unauthorized template should have been rejected');
    } catch (error) {
      console.log('✅ Unauthorized template correctly rejected:', error.message);
    }
  }

  async demoSecureManagement() {
    console.log(chalk.cyan('\n🛡️ Secure Template Management Demo'));
    
    const secureManager = new SecureTemplateManager();
    const auditLogger = new AuditLogger();

    // Register templates with audit logging
    const templates = [
      {
        name: 'welcome-email',
        content: '<h1>Welcome {{name}}!</h1><p>{{message}}</p>'
      },
      {
        name: 'order-confirmation',
        content: '<h2>Order #{{orderId}}</h2><p>Total: ${{total}}</p>'
      },
      {
        name: 'password-reset',
        content: '<p>Reset your password: <a href="{{resetUrl}}">Click here</a></p>'
      }
    ];

    for (const template of templates) {
      try {
        secureManager.registerTemplate(template.name, template.content);
        auditLogger.log('TEMPLATE_REGISTERED', {
          template: template.name,
          user: 'admin',
          timestamp: new Date().toISOString()
        });
        console.log(`✅ Template registered: ${template.name}`);
      } catch (error) {
        console.log(`❌ Template registration failed: ${template.name} - ${error.message}`);
      }
    }

    // Test template rendering with access control
    console.log('\nTesting template rendering with access control:');
    const renderJobs = [
      {
        template: 'welcome-email',
        data: { name: 'Alice', message: 'Welcome to our platform!' },
        user: 'admin'
      },
      {
        template: 'order-confirmation',
        data: { orderId: '12345', total: 99.99 },
        user: 'user'
      },
      {
        template: 'password-reset',
        data: { resetUrl: 'https://example.com/reset?token=abc123' },
        user: 'system'
      }
    ];

    for (const job of renderJobs) {
      try {
        const result = secureManager.renderWithAccessControl(job.template, job.data, job.user);
        auditLogger.log('TEMPLATE_RENDERED', {
          template: job.template,
          user: job.user,
          timestamp: new Date().toISOString()
        });
        console.log(`✅ Template rendered: ${job.template} by ${job.user}`);
      } catch (error) {
        console.log(`❌ Template render failed: ${job.template} - ${error.message}`);
      }
    }

    // Show audit log
    console.log('\nAudit Log:');
    const auditLog = auditLogger.getLog();
    auditLog.slice(-5).forEach(entry => {
      console.log(`${entry.timestamp} - ${entry.action} - ${entry.details.template} by ${entry.details.user}`);
    });
  }
}

/**
 * Secure Template Engine with validation and sanitization
 */
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
      return this.sanitizeString(value);
    }
    return value;
  }

  sanitizeString(str) {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<img[^>]*on\w+\s*=\s*["'][^"']*["'][^>]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }

  render(template, data) {
    const sanitizedData = this.sanitize(data);
    return template(sanitizedData);
  }
}

/**
 * Content Security Policy Manager
 */
class CSPManager {
  generateCSP(environment) {
    const policies = {
      development: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' ws: wss:",
        "frame-ancestors 'none'"
      ],
      staging: [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'"
      ],
      production: [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests"
      ]
    };

    return policies[environment].join('; ');
  }

  checkViolation(violation, environment) {
    const csp = this.generateCSP(environment);
    
    const blockedPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /<script\b[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i
    ];

    return blockedPatterns.some(pattern => pattern.test(violation));
  }
}

/**
 * Secure Template Manager with injection prevention
 */
class SecureTemplateManager {
  constructor() {
    this.allowedTemplates = new Set();
    this.templateContext = {};
    this.accessControl = new Map();
  }

  registerTemplate(name, template) {
    if (this.isValidTemplate(template)) {
      this.allowedTemplates.add(name);
      this.templateContext[name] = template;
      return true;
    }
    throw new Error(`Template contains dangerous patterns: ${name}`);
  }

  isValidTemplate(template) {
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /require\s*\(/,
      /process\./,
      /__dirname/,
      /__filename/,
      /global\./,
      /console\./,
      /setTimeout\s*\(/,
      /setInterval\s*\(/
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

  renderWithAccessControl(templateName, data, user) {
    // Check access permissions
    if (!this.hasAccess(user, templateName)) {
      throw new Error(`Access denied for template: ${templateName}`);
    }

    return this.render(templateName, data);
  }

  hasAccess(user, templateName) {
    const permissions = this.accessControl.get(user) || [];
    return permissions.includes(templateName) || user === 'admin';
  }

  grantAccess(user, templateName) {
    if (!this.accessControl.has(user)) {
      this.accessControl.set(user, []);
    }
    this.accessControl.get(user).push(templateName);
  }
}

/**
 * Audit Logger for security events
 */
class AuditLogger {
  constructor() {
    this.log = [];
  }

  log(action, details) {
    this.log.push({
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  getLog() {
    return this.log;
  }

  getLogByAction(action) {
    return this.log.filter(entry => entry.action === action);
  }

  getLogByUser(user) {
    return this.log.filter(entry => entry.details.user === user);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new SecurityPractices();
  demo.run().catch(console.error);
}

module.exports = {
  SecurityPractices,
  SecureTemplateEngine,
  CSPManager,
  SecureTemplateManager,
  AuditLogger
};
