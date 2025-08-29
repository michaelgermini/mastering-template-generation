const chalk = require('chalk');
const ora = require('ora');

/**
 * AI-Assisted Template Generation Examples
 * Demonstrates AI-powered template generation, optimization, and suggestions
 */
class AITemplateGeneration {
  constructor() {
    this.spinner = ora();
    this.aiModel = new SimulatedAIModel();
    this.templateGenerator = new AITemplateGenerator(this.aiModel);
    this.suggestions = new AITemplateSuggestions(this.aiModel);
    this.semanticMatcher = new SemanticTemplateMatcher(this.aiModel);
  }

  async run() {
    console.log(chalk.blue.bold('\n🤖 AI-Assisted Template Generation Examples\n'));
    
    console.log(chalk.yellow('\n1. AI-Powered Template Generation'));
    await this.demoTemplateGeneration();
    
    console.log(chalk.yellow('\n2. AI Template Optimization'));
    await this.demoTemplateOptimization();
    
    console.log(chalk.yellow('\n3. AI Template Suggestions'));
    await this.demoTemplateSuggestions();
    
    console.log(chalk.yellow('\n4. Semantic Template Matching'));
    await this.demoSemanticMatching();
    
    console.log(chalk.green('\n✅ AI template generation examples completed!'));
  }

  async demoTemplateGeneration() {
    console.log(chalk.cyan('\n🚀 AI Template Generation Demo'));
    
    const prompts = [
      'Create a user profile card template with avatar, name, email, and bio',
      'Generate an email newsletter template with header, content sections, and footer',
      'Design a product catalog template with image, title, price, and description'
    ];

    for (const prompt of prompts) {
      console.log(`\nGenerating template for: "${prompt}"`);
      
      const template = await this.templateGenerator.generateTemplate(prompt, {
        style: 'modern',
        responsive: true,
        accessibility: true
      });

      console.log('Generated Template:');
      console.log(chalk.gray(template.template.substring(0, 200) + '...'));
      console.log('Variables:', template.variables.join(', '));
    }
  }

  async demoTemplateOptimization() {
    console.log(chalk.cyan('\n⚡ AI Template Optimization Demo'));
    
    const originalTemplate = `
      <div class="user-card">
        <img src="{{avatar}}" alt="{{name}}" class="avatar">
        <h3>{{name}}</h3>
        <p>{{email}}</p>
        <p>{{bio}}</p>
        {{#if isAdmin}}
          <span class="admin-badge">Admin</span>
        {{/if}}
      </div>
    `;

    console.log('Original Template:');
    console.log(chalk.gray(originalTemplate));

    const performanceData = {
      renderTime: 45,
      memoryUsage: 2.3,
      userEngagement: 0.67
    };

    console.log('\nOptimizing template...');
    const optimizedTemplate = await this.templateGenerator.optimizeTemplate(
      originalTemplate, 
      performanceData
    );

    console.log('Optimized Template:');
    console.log(chalk.gray(optimizedTemplate.substring(0, 200) + '...'));
  }

  async demoTemplateSuggestions() {
    console.log(chalk.cyan('\n💡 AI Template Suggestions Demo'));
    
    const userContext = {
      role: 'developer',
      project: 'e-commerce',
      preferences: ['modern', 'responsive', 'accessible'],
      recentTemplates: ['product-card', 'user-profile']
    };

    console.log('User Context:', userContext);

    const suggestions = await this.suggestions.suggestTemplates(userContext);
    
    console.log('\nAI Suggestions:');
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.name} (${suggestion.confidence}% confidence)`);
      console.log(`   ${suggestion.description}`);
    });

    // Predict future template needs
    const userActivity = {
      currentPage: 'product-listing',
      actions: ['view', 'filter', 'sort'],
      timeSpent: 300
    };

    console.log('\nPredicting template needs...');
    const predictedNeeds = await this.suggestions.predictTemplateNeeds(userActivity);
    
    console.log('Predicted Template Needs:');
    predictedNeeds.forEach(need => {
      console.log(`- ${need.template} (${need.probability}% probability)`);
    });
  }

  async demoSemanticMatching() {
    console.log(chalk.cyan('\n🔍 Semantic Template Matching Demo'));
    
    // Index some templates
    const templates = new Map([
      ['user-profile', { description: 'User profile display with avatar and contact information' }],
      ['product-card', { description: 'Product display card with image, title, and price' }],
      ['email-newsletter', { description: 'Email newsletter template with header and content sections' }],
      ['dashboard-widget', { description: 'Dashboard widget showing key metrics and data' }],
      ['contact-form', { description: 'Contact form with input fields and submit button' }]
    ]);

    // Index templates for semantic search
    for (const [id, template] of templates) {
      await this.semanticMatcher.indexTemplate(id, template);
    }

    const queries = [
      'Show me templates for displaying user information',
      'I need a template for product listings',
      'Looking for email templates',
      'Dashboard components for data visualization'
    ];

    for (const query of queries) {
      console.log(`\nSearching for: "${query}"`);
      
      const similarTemplates = await this.semanticMatcher.findSimilarTemplates(query, templates);
      
      console.log('Similar Templates:');
      similarTemplates.forEach((result, index) => {
        console.log(`${index + 1}. ${result.id} (${(result.similarity * 100).toFixed(1)}% similarity)`);
      });
    }
  }
}

/**
 * Simulated AI Model for demonstration
 */
class SimulatedAIModel {
  async generate(options) {
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const { prompt, context } = options;

    if (prompt.includes('user profile')) {
      return {
        template: `
          <div class="user-profile-card">
            <div class="avatar-section">
              <img src="{{avatar}}" alt="{{name}}" class="user-avatar">
              {{#if isVerified}}
                <span class="verification-badge">✓</span>
              {{/if}}
            </div>
            <div class="user-info">
              <h2 class="user-name">{{name}}</h2>
              <p class="user-email">{{email}}</p>
              <p class="user-bio">{{bio}}</p>
              <div class="user-stats">
                <span class="stat">Posts: {{postCount}}</span>
                <span class="stat">Followers: {{followerCount}}</span>
              </div>
            </div>
          </div>
        `,
        variables: ['avatar', 'name', 'email', 'bio', 'isVerified', 'postCount', 'followerCount'],
        metadata: { type: 'user-profile', responsive: true }
      };
    }

    if (prompt.includes('email newsletter')) {
      return {
        template: `
          <div class="email-newsletter">
            <header class="newsletter-header">
              <h1>{{newsletterTitle}}</h1>
              <p class="newsletter-subtitle">{{newsletterSubtitle}}</p>
            </header>
            <main class="newsletter-content">
              {{#each articles}}
                <article class="newsletter-article">
                  <h3>{{title}}</h3>
                  <p>{{excerpt}}</p>
                  <a href="{{readMoreUrl}}" class="read-more">Read More</a>
                </article>
              {{/each}}
            </main>
            <footer class="newsletter-footer">
              <p>{{footerText}}</p>
              <a href="{{unsubscribeUrl}}" class="unsubscribe">Unsubscribe</a>
            </footer>
          </div>
        `,
        variables: ['newsletterTitle', 'newsletterSubtitle', 'articles', 'footerText', 'unsubscribeUrl'],
        metadata: { type: 'email-newsletter', responsive: true }
      };
    }

    if (prompt.includes('product catalog')) {
      return {
        template: `
          <div class="product-catalog">
            {{#each products}}
              <div class="product-item">
                <div class="product-image">
                  <img src="{{image}}" alt="{{name}}">
                  {{#if isOnSale}}
                    <span class="sale-badge">Sale!</span>
                  {{/if}}
                </div>
                <div class="product-details">
                  <h3 class="product-name">{{name}}</h3>
                  <p class="product-description">{{description}}</p>
                  <div class="product-price">
                    {{#if originalPrice}}
                      <span class="original-price">${{originalPrice}}</span>
                    {{/if}}
                    <span class="current-price">${{price}}</span>
                  </div>
                  <button class="add-to-cart" data-product-id="{{id}}">Add to Cart</button>
                </div>
              </div>
            {{/each}}
          </div>
        `,
        variables: ['products'],
        metadata: { type: 'product-catalog', responsive: true }
      };
    }

    // Default template
    return {
      template: `<div class="ai-generated">{{content}}</div>`,
      variables: ['content'],
      metadata: { type: 'generic' }
    };
  }

  async predict(options) {
    await new Promise(resolve => setTimeout(resolve, 200));

    const { input, model } = options;

    if (model === 'template-prediction') {
      return {
        templates: [
          { template: 'product-detail', probability: 85 },
          { template: 'shopping-cart', probability: 72 },
          { template: 'checkout-form', probability: 68 }
        ]
      };
    }

    return { templates: [] };
  }

  async embed(text) {
    // Simulate text embedding
    const embedding = [];
    for (let i = 0; i < 384; i++) {
      embedding.push(Math.random() - 0.5);
    }
    return embedding;
  }
}

/**
 * AI Template Generator
 */
class AITemplateGenerator {
  constructor(aiModel) {
    this.aiModel = aiModel;
    this.templateCache = new Map();
  }

  async generateTemplate(prompt, context) {
    const cacheKey = `${prompt}-${JSON.stringify(context)}`;
    
    if (this.templateCache.has(cacheKey)) {
      return this.templateCache.get(cacheKey);
    }

    const aiResponse = await this.aiModel.generate({
      prompt: `Create a template for: ${prompt}`,
      context: context,
      maxTokens: 1000
    });

    this.templateCache.set(cacheKey, aiResponse);
    return aiResponse;
  }

  async optimizeTemplate(template, performanceData) {
    const optimizationPrompt = this.buildOptimizationPrompt(template, performanceData);
    
    const optimizedTemplate = await this.aiModel.generate({
      prompt: optimizationPrompt,
      context: { originalTemplate: template }
    });

    return optimizedTemplate.template;
  }

  buildOptimizationPrompt(template, performanceData) {
    return `
      Optimize this template for better performance:
      
      Template: ${template}
      
      Performance Data:
      - Render Time: ${performanceData.renderTime}ms
      - Memory Usage: ${performanceData.memoryUsage}MB
      - User Engagement: ${performanceData.userEngagement}
      
      Focus on:
      - Reducing render time
      - Optimizing memory usage
      - Improving user engagement
    `;
  }
}

/**
 * AI Template Suggestions
 */
class AITemplateSuggestions {
  constructor(aiModel, userBehavior) {
    this.aiModel = aiModel;
    this.userBehavior = userBehavior;
  }

  async suggestTemplates(userContext) {
    const suggestions = await this.aiModel.generate({
      prompt: `Suggest templates for user with context: ${JSON.stringify(userContext)}`,
      context: {
        userHistory: this.getUserHistory(),
        popularTemplates: this.getPopularTemplates(),
        userPreferences: userContext.preferences
      }
    });

    return this.rankSuggestions(suggestions, userContext);
  }

  async predictTemplateNeeds(userActivity) {
    const prediction = await this.aiModel.predict({
      input: userActivity,
      model: 'template-prediction'
    });

    return prediction.templates;
  }

  getUserHistory() {
    return [
      { template: 'product-card', usage: 15, lastUsed: Date.now() - 86400000 },
      { template: 'user-profile', usage: 8, lastUsed: Date.now() - 172800000 }
    ];
  }

  getPopularTemplates() {
    return [
      { name: 'product-card', popularity: 95 },
      { name: 'user-profile', popularity: 87 },
      { name: 'email-newsletter', popularity: 76 }
    ];
  }

  rankSuggestions(suggestions, userContext) {
    return [
      {
        name: 'product-detail',
        confidence: 92,
        description: 'Detailed product view with images, specs, and reviews'
      },
      {
        name: 'shopping-cart',
        confidence: 85,
        description: 'Shopping cart with product list and checkout options'
      },
      {
        name: 'order-confirmation',
        confidence: 78,
        description: 'Order confirmation page with order details and tracking'
      }
    ];
  }
}

/**
 * Semantic Template Matcher
 */
class SemanticTemplateMatcher {
  constructor(aiModel) {
    this.aiModel = aiModel;
    this.templateIndex = new Map();
  }

  async findSimilarTemplates(query, templates) {
    const queryEmbedding = await this.aiModel.embed(query);
    
    const similarities = [];
    for (const [id, template] of templates) {
      const templateEmbedding = await this.aiModel.embed(template.description);
      const similarity = this.calculateSimilarity(queryEmbedding, templateEmbedding);
      
      similarities.push({
        id: id,
        template: template,
        similarity: similarity
      });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  }

  async indexTemplate(templateId, template) {
    const embedding = await this.aiModel.embed(template.description);
    this.templateIndex.set(templateId, {
      template: template,
      embedding: embedding
    });
  }

  calculateSimilarity(embedding1, embedding2) {
    const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new AITemplateGeneration();
  demo.run().catch(console.error);
}

module.exports = {
  AITemplateGeneration,
  SimulatedAIModel,
  AITemplateGenerator,
  AITemplateSuggestions,
  SemanticTemplateMatcher
};
