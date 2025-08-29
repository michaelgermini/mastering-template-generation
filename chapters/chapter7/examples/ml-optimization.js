const chalk = require('chalk');
const ora = require('ora');

/**
 * Machine Learning Optimization Examples
 * Demonstrates ML-based template optimization, A/B testing, and performance prediction
 */
class MLOptimization {
  constructor() {
    this.spinner = ora();
    this.mlModel = new SimulatedMLModel();
    this.optimizer = new MLTemplateOptimizer(this.mlModel);
    this.abTesting = new MLABTesting(this.mlModel);
    this.predictor = new TemplatePerformancePredictor(this.mlModel);
  }

  async run() {
    console.log(chalk.blue.bold('\n🧠 Machine Learning Optimization Examples\n'));
    
    console.log(chalk.yellow('\n1. ML-Based Template Optimization'));
    await this.demoMLOptimization();
    
    console.log(chalk.yellow('\n2. A/B Testing with Machine Learning'));
    await this.demoABTesting();
    
    console.log(chalk.yellow('\n3. Performance Prediction'));
    await this.demoPerformancePrediction();
    
    console.log(chalk.yellow('\n4. Automated Template Improvement'));
    await this.demoAutomatedImprovement();
    
    console.log(chalk.green('\n✅ ML optimization examples completed!'));
  }

  async demoMLOptimization() {
    console.log(chalk.cyan('\n⚡ ML Template Optimization Demo'));
    
    const templates = [
      {
        name: 'user-card',
        template: `
          <div class="user-card">
            <img src="{{avatar}}" alt="{{name}}" class="avatar">
            <h3>{{name}}</h3>
            <p>{{email}}</p>
            <p>{{bio}}</p>
            {{#if isAdmin}}
              <span class="admin-badge">Admin</span>
            {{/if}}
          </div>
        `,
        metrics: { renderTime: 45, memoryUsage: 2.3, userEngagement: 0.67 }
      },
      {
        name: 'product-grid',
        template: `
          <div class="product-grid">
            {{#each products}}
              <div class="product-card">
                <img src="{{image}}" alt="{{name}}">
                <h4>{{name}}</h4>
                <p class="price">${{price}}</p>
                <button onclick="addToCart('{{id}}')">Add to Cart</button>
              </div>
            {{/each}}
          </div>
        `,
        metrics: { renderTime: 78, memoryUsage: 4.1, userEngagement: 0.82 }
      }
    ];

    for (const templateData of templates) {
      console.log(`\nOptimizing template: ${templateData.name}`);
      console.log('Original metrics:', templateData.metrics);
      
      const optimizedTemplate = await this.optimizer.optimizeTemplate(
        templateData.template, 
        templateData.metrics
      );
      
      console.log('Optimization suggestions applied');
      console.log('Optimized template preview:', optimizedTemplate.substring(0, 100) + '...');
    }
  }

  async demoABTesting() {
    console.log(chalk.cyan('\n🔬 A/B Testing with ML Demo'));
    
    const baseTemplate = `
      <div class="product-card">
        <img src="{{image}}" alt="{{name}}">
        <h3>{{name}}</h3>
        <p class="price">${{price}}</p>
        <button class="cta-button">Add to Cart</button>
      </div>
    `;

    console.log('Creating A/B test variants...');
    const variants = await this.abTesting.createVariants(baseTemplate, 3);
    
    console.log(`Created ${variants.length} variants for testing`);
    
    // Simulate user interactions
    const userContexts = [
      { device: 'mobile', location: 'US', timeOfDay: 'morning' },
      { device: 'desktop', location: 'EU', timeOfDay: 'evening' },
      { device: 'tablet', location: 'ASIA', timeOfDay: 'afternoon' }
    ];

    for (const context of userContexts) {
      console.log(`\nSelecting best variant for user context:`, context);
      
      const bestVariant = await this.abTesting.selectBestVariant(context);
      console.log(`Selected variant: ${bestVariant.id} (confidence: ${bestVariant.confidence}%)`);
      
      // Simulate performance results
      const performance = {
        clickRate: Math.random() * 0.3 + 0.1,
        conversionRate: Math.random() * 0.15 + 0.05,
        timeOnPage: Math.random() * 60 + 30
      };
      
      this.abTesting.recordResult(bestVariant.id, performance);
      console.log('Performance recorded:', performance);
    }
  }

  async demoPerformancePrediction() {
    console.log(chalk.cyan('\n📊 Performance Prediction Demo'));
    
    const templates = [
      {
        name: 'simple-card',
        complexity: 'low',
        variables: 3,
        conditionals: 0,
        loops: 0
      },
      {
        name: 'complex-dashboard',
        complexity: 'high',
        variables: 15,
        conditionals: 8,
        loops: 3
      },
      {
        name: 'medium-form',
        complexity: 'medium',
        variables: 8,
        conditionals: 4,
        loops: 1
      }
    ];

    for (const template of templates) {
      console.log(`\nPredicting performance for: ${template.name}`);
      
      const prediction = await this.predictor.predictPerformance(template);
      
      console.log('Predicted Performance:');
      console.log(`  Render Time: ${prediction.renderTime.toFixed(1)}ms`);
      console.log(`  Memory Usage: ${prediction.memoryUsage.toFixed(1)}MB`);
      console.log(`  User Engagement: ${(prediction.userEngagement * 100).toFixed(1)}%`);
      console.log(`  Confidence: ${prediction.confidence}%`);
      
      // Get optimization recommendations
      const recommendations = await this.predictor.getOptimizationRecommendations(template);
      console.log('Optimization Recommendations:');
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec.suggestion} (impact: ${rec.impact})`);
      });
    }
  }

  async demoAutomatedImprovement() {
    console.log(chalk.cyan('\n🤖 Automated Template Improvement Demo'));
    
    const template = `
      <div class="user-profile">
        <div class="profile-header">
          <img src="{{avatar}}" alt="{{name}}" class="profile-avatar">
          <h1>{{name}}</h1>
          <p>{{title}}</p>
        </div>
        <div class="profile-content">
          <p>{{bio}}</p>
          <div class="stats">
            <span>Posts: {{postCount}}</span>
            <span>Followers: {{followerCount}}</span>
            <span>Following: {{followingCount}}</span>
          </div>
        </div>
        {{#if isAdmin}}
          <div class="admin-panel">
            <button>Manage Users</button>
            <button>View Analytics</button>
          </div>
        {{/if}}
      </div>
    `;

    console.log('Original template complexity analysis...');
    const analysis = this.analyzeTemplateComplexity(template);
    console.log('Complexity Analysis:', analysis);

    console.log('\nRunning automated improvement...');
    const improvements = await this.runAutomatedImprovement(template);
    
    console.log('Improvements Applied:');
    improvements.forEach((improvement, index) => {
      console.log(`  ${index + 1}. ${improvement.type}: ${improvement.description}`);
      console.log(`     Impact: ${improvement.impact}`);
    });

    console.log('\nImproved Template:');
    console.log(chalk.gray(improvements[improvements.length - 1].template.substring(0, 200) + '...'));
  }
}

/**
 * Simulated ML Model
 */
class SimulatedMLModel {
  async predict(options) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { input, context } = options;
    
    if (context && context.variants) {
      // A/B testing prediction
      const bestVariant = Math.floor(Math.random() * context.variants.length);
      return {
        bestVariant: bestVariant,
        confidence: Math.random() * 30 + 70
      };
    }
    
    if (input && input.complexity) {
      // Performance prediction
      const baseRenderTime = input.complexity === 'low' ? 20 : input.complexity === 'medium' ? 50 : 120;
      const baseMemory = input.complexity === 'low' ? 1.5 : input.complexity === 'medium' ? 3.0 : 6.0;
      
      return {
        renderTime: baseRenderTime + Math.random() * 20,
        memoryUsage: baseMemory + Math.random() * 2,
        userEngagement: 0.5 + Math.random() * 0.4,
        confidence: 75 + Math.random() * 20
      };
    }
    
    return { success: true };
  }

  async generate(options) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const { prompt, context } = options;
    
    if (prompt.includes('variant')) {
      const variants = [
        {
          id: 0,
          template: context.baseTemplate.replace('cta-button', 'primary-button'),
          confidence: 85
        },
        {
          id: 1,
          template: context.baseTemplate.replace('Add to Cart', 'Buy Now'),
          confidence: 78
        },
        {
          id: 2,
          template: context.baseTemplate.replace('cta-button', 'cta-button large'),
          confidence: 82
        }
      ];
      
      return variants[context.variantIndex || 0];
    }
    
    return { template: 'optimized-template', confidence: 90 };
  }

  async train(data) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Training model with ${data.length} samples...`);
    return { success: true, accuracy: 0.87 };
  }
}

/**
 * ML Template Optimizer
 */
class MLTemplateOptimizer {
  constructor(mlModel) {
    this.mlModel = mlModel;
    this.performanceData = [];
  }

  async optimizeTemplate(template, metrics) {
    // Collect performance data
    this.performanceData.push({
      template: template,
      metrics: metrics,
      timestamp: Date.now()
    });

    // Train model on performance data
    await this.trainModel();

    // Generate optimization suggestions
    const suggestions = await this.mlModel.predict({
      input: template,
      context: this.performanceData
    });

    return this.applyOptimizations(template, suggestions);
  }

  async trainModel() {
    if (this.performanceData.length < 10) return;

    const trainingData = this.performanceData.map(data => ({
      input: data.template,
      output: data.metrics.performance
    }));

    await this.mlModel.train(trainingData);
  }

  applyOptimizations(template, suggestions) {
    let optimizedTemplate = template;

    // Apply common optimizations
    optimizedTemplate = this.applyCacheOptimization(optimizedTemplate);
    optimizedTemplate = this.reduceVariables(optimizedTemplate);
    optimizedTemplate = this.optimizeConditionals(optimizedTemplate);

    return optimizedTemplate;
  }

  applyCacheOptimization(template) {
    // Add caching hints
    return template.replace(
      '<div class="user-card">',
      '<div class="user-card" data-cache="true">'
    );
  }

  reduceVariables(template) {
    // Optimize variable usage
    return template.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      if (variable === 'bio' && !template.includes('bio')) {
        return '';
      }
      return match;
    });
  }

  optimizeConditionals(template) {
    // Optimize conditional logic
    return template.replace(
      /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, condition, content) => {
        if (condition === 'isAdmin' && content.length > 100) {
          return `{{#if ${condition}}}<div class="admin-section">${content}</div>{{/if}}`;
        }
        return match;
      }
    );
  }
}

/**
 * ML A/B Testing
 */
class MLABTesting {
  constructor(mlModel) {
    this.mlModel = mlModel;
    this.variants = new Map();
    this.results = [];
  }

  async createVariants(baseTemplate, numVariants = 3) {
    const variants = [];

    for (let i = 0; i < numVariants; i++) {
      const variant = await this.mlModel.generate({
        prompt: `Create a variant of this template: ${baseTemplate}`,
        context: { baseTemplate, variantIndex: i }
      });

      variants.push(variant);
      this.variants.set(i, variant);
    }

    return variants;
  }

  async selectBestVariant(userContext) {
    const prediction = await this.mlModel.predict({
      input: userContext,
      context: { variants: Array.from(this.variants.values()) }
    });

    return this.variants.get(prediction.bestVariant);
  }

  recordResult(variantId, performance) {
    this.results.push({
      variantId,
      performance,
      timestamp: Date.now()
    });

    // Retrain model with new data
    this.retrainModel();
  }

  async retrainModel() {
    if (this.results.length < 5) return;

    const trainingData = this.results.map(result => ({
      input: { variantId: result.variantId },
      output: result.performance
    }));

    await this.mlModel.train(trainingData);
  }
}

/**
 * Template Performance Predictor
 */
class TemplatePerformancePredictor {
  constructor(mlModel) {
    this.mlModel = mlModel;
  }

  async predictPerformance(template) {
    const prediction = await this.mlModel.predict({
      input: template,
      context: { predictionType: 'performance' }
    });

    return prediction;
  }

  async getOptimizationRecommendations(template) {
    const recommendations = [];

    if (template.complexity === 'high') {
      recommendations.push({
        suggestion: 'Reduce template complexity by splitting into smaller components',
        impact: 'high'
      });
    }

    if (template.variables > 10) {
      recommendations.push({
        suggestion: 'Reduce number of variables to improve performance',
        impact: 'medium'
      });
    }

    if (template.conditionals > 5) {
      recommendations.push({
        suggestion: 'Optimize conditional logic by pre-processing data',
        impact: 'medium'
      });
    }

    return recommendations;
  }
}

/**
 * Template Analysis and Improvement
 */
function analyzeTemplateComplexity(template) {
  const variables = (template.match(/\{\{(\w+)\}\}/g) || []).length;
  const conditionals = (template.match(/\{\{#if/g) || []).length;
  const loops = (template.match(/\{\{#each/g) || []).length;
  
  let complexity = 'low';
  if (variables > 10 || conditionals > 5 || loops > 2) {
    complexity = 'high';
  } else if (variables > 5 || conditionals > 2 || loops > 1) {
    complexity = 'medium';
  }

  return {
    complexity,
    variables,
    conditionals,
    loops,
    totalElements: variables + conditionals + loops
  };
}

async function runAutomatedImprovement(template) {
  const improvements = [];
  let currentTemplate = template;

  // Improvement 1: Add lazy loading
  currentTemplate = currentTemplate.replace(
    '<img src="{{avatar}}"',
    '<img src="{{avatar}}" loading="lazy"'
  );
  improvements.push({
    type: 'Performance',
    description: 'Added lazy loading for images',
    impact: 'medium',
    template: currentTemplate
  });

  // Improvement 2: Optimize conditionals
  currentTemplate = currentTemplate.replace(
    /\{\{#if isAdmin\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (match, content) => {
      return `<div class="admin-section" data-admin="{{isAdmin}}">${content}</div>`;
    }
  );
  improvements.push({
    type: 'Logic',
    description: 'Optimized conditional rendering',
    impact: 'high',
    template: currentTemplate
  });

  // Improvement 3: Add semantic HTML
  currentTemplate = currentTemplate.replace(
    '<div class="profile-header">',
    '<header class="profile-header">'
  );
  improvements.push({
    type: 'Accessibility',
    description: 'Improved semantic HTML structure',
    impact: 'low',
    template: currentTemplate
  });

  return improvements;
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new MLOptimization();
  demo.run().catch(console.error);
}

module.exports = {
  MLOptimization,
  SimulatedMLModel,
  MLTemplateOptimizer,
  MLABTesting,
  TemplatePerformancePredictor
};
