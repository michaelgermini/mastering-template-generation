const chalk = require('chalk');
const ora = require('ora');

/**
 * Deployment and Monitoring Examples
 * Demonstrates environment configuration, monitoring, error handling, and health checks
 */
class DeploymentMonitoring {
  constructor() {
    this.spinner = ora();
    this.environmentConfig = new EnvironmentConfig(process.env.NODE_ENV || 'development');
    this.performanceMonitor = new TemplatePerformanceMonitor();
    this.errorHandler = new TemplateErrorHandler(new ConsoleLogger());
    this.healthChecker = new HealthChecker();
  }

  async run() {
    console.log(chalk.blue.bold('\n🚀 Deployment and Monitoring Examples\n'));
    
    console.log(chalk.yellow('\n1. Environment-Specific Configuration'));
    await this.demoEnvironmentConfig();
    
    console.log(chalk.yellow('\n2. Performance Monitoring'));
    await this.demoPerformanceMonitoring();
    
    console.log(chalk.yellow('\n3. Error Handling and Logging'));
    await this.demoErrorHandling();
    
    console.log(chalk.yellow('\n4. Health Checks and Metrics'));
    await this.demoHealthChecks();
    
    console.log(chalk.yellow('\n5. Production Deployment System'));
    await this.demoProductionSystem();
    
    console.log(chalk.green('\n✅ Deployment and monitoring examples completed!'));
  }

  async demoEnvironmentConfig() {
    console.log(chalk.cyan('\n⚙️ Environment Configuration Demo'));
    
    const environments = ['development', 'staging', 'production'];
    
    for (const env of environments) {
      console.log(`\n${env.toUpperCase()} Environment:`);
      const config = new EnvironmentConfig(env);
      const templateConfig = config.getTemplateConfig();
      
      console.log('Template Configuration:');
      console.log(`  Cache enabled: ${templateConfig.enableCache}`);
      console.log(`  Minification: ${templateConfig.enableMinification}`);
      console.log(`  Debug mode: ${templateConfig.enableDebug}`);
      console.log(`  CDN URL: ${templateConfig.cdnUrl || 'None'}`);
      
      // Show environment-specific settings
      const settings = config.getEnvironmentSettings();
      console.log('Environment Settings:');
      for (const [key, value] of Object.entries(settings)) {
        console.log(`  ${key}: ${value}`);
      }
    }
  }

  async demoPerformanceMonitoring() {
    console.log(chalk.cyan('\n📊 Performance Monitoring Demo'));
    
    // Simulate template rendering with monitoring
    const templates = ['user-card', 'product-grid', 'email-template'];
    const iterations = 5;
    
    console.log(`\nSimulating ${iterations} renders for each template...`);
    
    for (let i = 0; i < iterations; i++) {
      for (const templateName of templates) {
        const timer = this.performanceMonitor.startTimer(templateName);
        
        // Simulate template rendering
        await this.simulateTemplateRender(templateName, {
          name: `User ${i}`,
          email: `user${i}@example.com`,
          products: [
            { name: `Product ${i}`, price: 29.99 + i }
          ]
        });
        
        const duration = this.performanceMonitor.endTimer(timer);
        console.log(`  ${templateName}: ${duration.toFixed(2)}ms`);
      }
    }
    
    // Display performance metrics
    console.log('\nPerformance Metrics:');
    for (const templateName of templates) {
      const metrics = this.performanceMonitor.getMetrics(templateName);
      if (metrics) {
        console.log(`\n${templateName}:`);
        console.log(`  Count: ${metrics.count}`);
        console.log(`  Average: ${metrics.average.toFixed(2)}ms`);
        console.log(`  Min: ${metrics.min.toFixed(2)}ms`);
        console.log(`  Max: ${metrics.max.toFixed(2)}ms`);
        console.log(`  P95: ${metrics.p95.toFixed(2)}ms`);
        
        // Performance alerts
        if (metrics.average > 100) {
          console.log(`  ⚠️  WARNING: High average render time`);
        }
        if (metrics.p95 > 200) {
          console.log(`  🚨 ALERT: High P95 render time`);
        }
      }
    }
  }

  async demoErrorHandling() {
    console.log(chalk.cyan('\n🛠️ Error Handling Demo'));
    
    // Test various error scenarios
    const errorScenarios = [
      {
        name: 'Template not found',
        template: 'non-existent-template',
        data: { name: 'Test' },
        expectedError: 'Template not found'
      },
      {
        name: 'Invalid template syntax',
        template: '{{name}',
        data: { name: 'Test' },
        expectedError: 'Invalid template syntax'
      },
      {
        name: 'Data validation error',
        template: 'user-card',
        data: { name: '', email: 'invalid-email' },
        expectedError: 'Data validation failed'
      }
    ];
    
    for (const scenario of errorScenarios) {
      console.log(`\nTesting: ${scenario.name}`);
      
      try {
        await this.renderTemplateWithErrorHandling(scenario.template, scenario.data);
        console.log('❌ Expected error but none occurred');
      } catch (error) {
        const handled = this.errorHandler.handleError(error, {
          templateName: scenario.template,
          data: scenario.data,
          error
        });
        
        console.log(`✅ Error handled: ${error.message}`);
        console.log(`Fallback template: ${handled.substring(0, 50)}...`);
      }
    }
    
    // Show error statistics
    console.log('\nError Statistics:');
    const errorStats = this.errorHandler.getErrorStats();
    for (const [errorKey, count] of Object.entries(errorStats)) {
      console.log(`  ${errorKey}: ${count} occurrences`);
    }
  }

  async demoHealthChecks() {
    console.log(chalk.cyan('\n🏥 Health Checks Demo'));
    
    // Run health checks
    const healthChecks = [
      {
        name: 'Template Cache Health',
        check: () => this.healthChecker.checkTemplateCache()
      },
      {
        name: 'Database Connection',
        check: () => this.healthChecker.checkDatabaseConnection()
      },
      {
        name: 'External API Status',
        check: () => this.healthChecker.checkExternalAPI()
      },
      {
        name: 'Memory Usage',
        check: () => this.healthChecker.checkMemoryUsage()
      },
      {
        name: 'Disk Space',
        check: () => this.healthChecker.checkDiskSpace()
      }
    ];
    
    console.log('\nRunning health checks...');
    const results = [];
    
    for (const healthCheck of healthChecks) {
      try {
        const result = await healthCheck.check();
        results.push({
          name: healthCheck.name,
          status: result.status,
          details: result.details
        });
        
        const statusIcon = result.status === 'healthy' ? '✅' : '❌';
        console.log(`${statusIcon} ${healthCheck.name}: ${result.status}`);
        
        if (result.details) {
          console.log(`  Details: ${result.details}`);
        }
      } catch (error) {
        results.push({
          name: healthCheck.name,
          status: 'error',
          details: error.message
        });
        console.log(`❌ ${healthCheck.name}: error - ${error.message}`);
      }
    }
    
    // Overall health status
    const healthyChecks = results.filter(r => r.status === 'healthy').length;
    const totalChecks = results.length;
    const healthPercentage = (healthyChecks / totalChecks) * 100;
    
    console.log(`\nOverall Health: ${healthPercentage.toFixed(1)}% (${healthyChecks}/${totalChecks})`);
    
    if (healthPercentage >= 80) {
      console.log('🟢 System is healthy');
    } else if (healthPercentage >= 60) {
      console.log('🟡 System has warnings');
    } else {
      console.log('🔴 System is unhealthy');
    }
  }

  async demoProductionSystem() {
    console.log(chalk.cyan('\n🏭 Production Deployment System Demo'));
    
    const productionSystem = new ProductionTemplateSystem();
    
    // Simulate production deployment
    console.log('\nDeploying to production...');
    
    // Pre-deployment checks
    const preDeploymentChecks = await productionSystem.runPreDeploymentChecks();
    console.log('Pre-deployment checks:');
    for (const check of preDeploymentChecks) {
      const statusIcon = check.passed ? '✅' : '❌';
      console.log(`  ${statusIcon} ${check.name}: ${check.passed ? 'PASSED' : 'FAILED'}`);
    }
    
    // Deploy if checks pass
    const allChecksPassed = preDeploymentChecks.every(check => check.passed);
    if (allChecksPassed) {
      console.log('\nAll checks passed. Deploying...');
      await productionSystem.deploy();
      console.log('✅ Deployment completed successfully');
    } else {
      console.log('\n❌ Deployment aborted due to failed checks');
    }
    
    // Post-deployment monitoring
    console.log('\nPost-deployment monitoring:');
    const monitoringData = await productionSystem.startMonitoring();
    
    console.log('Monitoring metrics:');
    for (const [metric, value] of Object.entries(monitoringData)) {
      console.log(`  ${metric}: ${value}`);
    }
  }

  async simulateTemplateRender(templateName, data) {
    // Simulate template rendering with random duration
    const duration = Math.random() * 50 + 10; // 10-60ms
    await new Promise(resolve => setTimeout(resolve, duration));
    
    // Simulate occasional errors
    if (Math.random() < 0.1) { // 10% chance of error
      throw new Error(`Simulated error in ${templateName}`);
    }
  }

  async renderTemplateWithErrorHandling(templateName, data) {
    // Simulate template rendering that might fail
    if (templateName === 'non-existent-template') {
      throw new Error('Template not found: non-existent-template');
    }
    
    if (templateName === '{{name}') {
      throw new Error('Invalid template syntax');
    }
    
    if (data.name === '') {
      throw new Error('Data validation failed: name cannot be empty');
    }
    
    return `<div>Rendered ${templateName}</div>`;
  }
}

/**
 * Environment Configuration Manager
 */
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
        cdn: false,
        logLevel: 'debug',
        database: 'sqlite://dev.db',
        apiUrl: 'http://localhost:3000'
      },
      staging: {
        debug: false,
        cache: true,
        minify: true,
        cdn: false,
        logLevel: 'info',
        database: 'postgresql://staging:5432',
        apiUrl: 'https://staging-api.example.com'
      },
      production: {
        debug: false,
        cache: true,
        minify: true,
        cdn: true,
        logLevel: 'warn',
        database: 'postgresql://production:5432',
        apiUrl: 'https://api.example.com'
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

  getEnvironmentSettings() {
    return {
      logLevel: this.config.logLevel,
      database: this.config.database,
      apiUrl: this.config.apiUrl
    };
  }
}

/**
 * Template Performance Monitor
 */
class TemplatePerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
  }

  startTimer(templateName) {
    return {
      templateName,
      startTime: process.hrtime.bigint()
    };
  }

  endTimer(timer) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - timer.startTime) / 1000000;

    if (!this.metrics.has(timer.templateName)) {
      this.metrics.set(timer.templateName, []);
    }

    this.metrics.get(timer.templateName).push(duration);

    // Keep only last 100 measurements
    const measurements = this.metrics.get(timer.templateName);
    if (measurements.length > 100) {
      measurements.shift();
    }

    // Check for performance alerts
    this.checkPerformanceAlerts(timer.templateName, duration);

    return duration;
  }

  checkPerformanceAlerts(templateName, duration) {
    if (duration > 200) {
      this.alerts.push({
        type: 'high_render_time',
        template: templateName,
        duration,
        timestamp: new Date().toISOString()
      });
    }
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

  getAlerts() {
    return this.alerts;
  }
}

/**
 * Template Error Handler
 */
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

/**
 * Console Logger
 */
class ConsoleLogger {
  error(message, details) {
    console.error(`[ERROR] ${message}`, details);
  }

  warn(message, details) {
    console.warn(`[WARN] ${message}`, details);
  }

  info(message, details) {
    console.log(`[INFO] ${message}`, details);
  }
}

/**
 * Health Checker
 */
class HealthChecker {
  async checkTemplateCache() {
    // Simulate cache health check
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      status: 'healthy',
      details: 'Cache is functioning normally'
    };
  }

  async checkDatabaseConnection() {
    // Simulate database health check
    await new Promise(resolve => setTimeout(resolve, 100));
    const isHealthy = Math.random() > 0.1; // 90% success rate
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      details: isHealthy ? 'Database connection successful' : 'Database connection failed'
    };
  }

  async checkExternalAPI() {
    // Simulate external API health check
    await new Promise(resolve => setTimeout(resolve, 200));
    const isHealthy = Math.random() > 0.2; // 80% success rate
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      details: isHealthy ? 'API responding normally' : 'API timeout'
    };
  }

  async checkMemoryUsage() {
    const usage = process.memoryUsage();
    const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
    const usagePercentage = (heapUsedMB / heapTotalMB) * 100;
    
    return {
      status: usagePercentage < 80 ? 'healthy' : 'warning',
      details: `${heapUsedMB}MB / ${heapTotalMB}MB (${usagePercentage.toFixed(1)}%)`
    };
  }

  async checkDiskSpace() {
    // Simulate disk space check
    await new Promise(resolve => setTimeout(resolve, 30));
    const freeSpace = Math.random() * 100; // 0-100%
    
    return {
      status: freeSpace > 20 ? 'healthy' : 'warning',
      details: `${freeSpace.toFixed(1)}% free space available`
    };
  }
}

/**
 * Production Template System
 */
class ProductionTemplateSystem {
  async runPreDeploymentChecks() {
    const checks = [
      {
        name: 'Template Syntax Validation',
        check: () => this.validateAllTemplates()
      },
      {
        name: 'Security Scan',
        check: () => this.runSecurityScan()
      },
      {
        name: 'Performance Baseline',
        check: () => this.runPerformanceBaseline()
      },
      {
        name: 'Database Migration',
        check: () => this.checkDatabaseMigration()
      }
    ];
    
    const results = [];
    for (const check of checks) {
      try {
        const passed = await check.check();
        results.push({ name: check.name, passed });
      } catch (error) {
        results.push({ name: check.name, passed: false });
      }
    }
    
    return results;
  }

  async validateAllTemplates() {
    // Simulate template validation
    await new Promise(resolve => setTimeout(resolve, 100));
    return Math.random() > 0.1; // 90% success rate
  }

  async runSecurityScan() {
    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 200));
    return Math.random() > 0.05; // 95% success rate
  }

  async runPerformanceBaseline() {
    // Simulate performance baseline check
    await new Promise(resolve => setTimeout(resolve, 150));
    return Math.random() > 0.1; // 90% success rate
  }

  async checkDatabaseMigration() {
    // Simulate database migration check
    await new Promise(resolve => setTimeout(resolve, 80));
    return Math.random() > 0.1; // 90% success rate
  }

  async deploy() {
    console.log('  Deploying templates...');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('  Updating configuration...');
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('  Restarting services...');
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async startMonitoring() {
    return {
      'Template Cache Hit Rate': '85%',
      'Average Response Time': '45ms',
      'Error Rate': '0.2%',
      'Active Connections': '1,234',
      'Memory Usage': '67%'
    };
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new DeploymentMonitoring();
  demo.run().catch(console.error);
}

module.exports = {
  DeploymentMonitoring,
  EnvironmentConfig,
  TemplatePerformanceMonitor,
  TemplateErrorHandler,
  HealthChecker,
  ProductionTemplateSystem
};
