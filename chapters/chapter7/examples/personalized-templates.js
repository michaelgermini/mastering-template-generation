const chalk = require('chalk');
const ora = require('ora');

/**
 * Personalized Templates Examples
 * Demonstrates user behavior analysis, context-aware adaptation, and real-time personalization
 */
class PersonalizedTemplates {
  constructor() {
    this.spinner = ora();
    this.mlModel = new SimulatedMLModel();
    this.behaviorAnalyzer = new UserBehaviorAnalyzer(this.mlModel);
    this.contextAdapter = new ContextAwareTemplates(this.mlModel);
    this.realTimePersonalizer = new RealTimePersonalizer(this.mlModel);
  }

  async run() {
    console.log(chalk.blue.bold('\n👤 Personalized Templates Examples\n'));
    
    console.log(chalk.yellow('\n1. User Behavior Analysis'));
    await this.demoUserBehaviorAnalysis();
    
    console.log(chalk.yellow('\n2. Context-Aware Template Adaptation'));
    await this.demoContextAdaptation();
    
    console.log(chalk.yellow('\n3. Real-Time Template Personalization'));
    await this.demoRealTimePersonalization();
    
    console.log(chalk.yellow('\n4. Personalized Template Recommendations'));
    await this.demoTemplateRecommendations();
    
    console.log(chalk.green('\n✅ Personalized templates examples completed!'));
  }

  async demoUserBehaviorAnalysis() {
    console.log(chalk.cyan('\n📊 User Behavior Analysis Demo'));
    
    const users = [
      {
        id: 'user1',
        name: 'Alex Developer',
        actions: [
          { type: 'page_view', page: 'documentation', duration: 300, timestamp: Date.now() - 3600000 },
          { type: 'click', element: 'api-example', timestamp: Date.now() - 1800000 },
          { type: 'download', file: 'code-template', timestamp: Date.now() - 900000 },
          { type: 'search', query: 'react components', timestamp: Date.now() - 300000 }
        ]
      },
      {
        id: 'user2',
        name: 'Maria Designer',
        actions: [
          { type: 'page_view', page: 'templates', duration: 120, timestamp: Date.now() - 7200000 },
          { type: 'click', element: 'preview-template', timestamp: Date.now() - 3600000 },
          { type: 'favorite', template: 'landing-page', timestamp: Date.now() - 1800000 },
          { type: 'share', template: 'email-newsletter', timestamp: Date.now() - 600000 }
        ]
      }
    ];

    for (const user of users) {
      console.log(`\nAnalyzing behavior for: ${user.name}`);
      
      const userProfile = await this.behaviorAnalyzer.analyzeUserBehavior(user.id, user.actions);
      
      console.log('User Profile:');
      console.log(`  Preferences: ${userProfile.preferences.join(', ')}`);
      console.log(`  Behavior Patterns: ${userProfile.behaviorPatterns.join(', ')}`);
      console.log(`  Content Preferences: ${userProfile.contentPreferences.join(', ')}`);
      console.log(`  Interaction Style: ${userProfile.interactionStyle}`);
      
      // Generate personalized template
      const baseTemplate = `
        <div class="dashboard">
          <h1>{{title}}</h1>
          <div class="content">{{content}}</div>
          <div class="actions">{{actions}}</div>
        </div>
      `;
      
      const personalizedTemplate = await this.behaviorAnalyzer.generatePersonalizedTemplate(
        user.id, 
        baseTemplate
      );
      
      console.log('Personalized Template Generated');
    }
  }

  async demoContextAdaptation() {
    console.log(chalk.cyan('\n🔄 Context-Aware Template Adaptation Demo'));
    
    const baseTemplate = `
      <div class="product-showcase">
        <h2>{{productName}}</h2>
        <p>{{description}}</p>
        <div class="features">
          {{#each features}}
            <div class="feature">{{this}}</div>
          {{/each}}
        </div>
        <button class="cta">{{ctaText}}</button>
      </div>
    `;

    const contexts = [
      {
        name: 'Mobile Shopping',
        context: {
          device: 'mobile',
          location: 'store',
          timeOfDay: 'afternoon',
          userIntent: 'browsing'
        }
      },
      {
        name: 'Desktop Research',
        context: {
          device: 'desktop',
          location: 'office',
          timeOfDay: 'morning',
          userIntent: 'research'
        }
      },
      {
        name: 'Tablet Comparison',
        context: {
          device: 'tablet',
          location: 'home',
          timeOfDay: 'evening',
          userIntent: 'comparison'
        }
      }
    ];

    for (const contextData of contexts) {
      console.log(`\nAdapting template for: ${contextData.name}`);
      
      const adaptedTemplate = await this.contextAdapter.adaptToContext(
        baseTemplate, 
        contextData.context
      );
      
      console.log('Context Analysis:');
      console.log(`  Type: ${contextData.context.device} - ${contextData.context.userIntent}`);
      console.log(`  Adaptations: ${contextData.context.device === 'mobile' ? 'Simplified layout' : 'Detailed view'}`);
      
      console.log('Adapted Template Preview:');
      console.log(chalk.gray(adaptedTemplate.substring(0, 150) + '...'));
    }
  }

  async demoRealTimePersonalization() {
    console.log(chalk.cyan('\n⚡ Real-Time Template Personalization Demo'));
    
    const userSession = {
      userId: 'user123',
      currentPage: 'product-detail',
      sessionStart: Date.now() - 1800000, // 30 minutes ago
      interactions: [
        { type: 'view', element: 'product-image', timestamp: Date.now() - 1200000 },
        { type: 'click', element: 'specifications', timestamp: Date.now() - 900000 },
        { type: 'scroll', element: 'reviews', timestamp: Date.now() - 600000 },
        { type: 'hover', element: 'add-to-cart', timestamp: Date.now() - 300000 }
      ]
    };

    console.log('Real-time user session analysis...');
    const realTimeProfile = await this.realTimePersonalizer.analyzeSession(userSession);
    
    console.log('Real-Time Profile:');
    console.log(`  Engagement Level: ${realTimeProfile.engagementLevel}`);
    console.log(`  Purchase Intent: ${realTimeProfile.purchaseIntent}%`);
    console.log(`  Preferred Content: ${realTimeProfile.preferredContent}`);
    console.log(`  Recommended Actions: ${realTimeProfile.recommendedActions.join(', ')}`);

    // Generate real-time personalized template
    const template = await this.realTimePersonalizer.generateRealTimeTemplate(userSession);
    
    console.log('\nReal-Time Personalized Template:');
    console.log(chalk.gray(template.substring(0, 200) + '...'));

    // Simulate real-time updates
    console.log('\nSimulating real-time updates...');
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const update = await this.realTimePersonalizer.updatePersonalization(userSession);
      console.log(`Update ${i + 1}: ${update.type} - ${update.description}`);
    }
  }

  async demoTemplateRecommendations() {
    console.log(chalk.cyan('\n💡 Personalized Template Recommendations Demo'));
    
    const userProfiles = [
      {
        id: 'developer1',
        role: 'developer',
        skills: ['JavaScript', 'React', 'Node.js'],
        projects: ['web-app', 'api-service'],
        preferences: ['code-focused', 'technical', 'minimal']
      },
      {
        id: 'designer1',
        role: 'designer',
        skills: ['UI/UX', 'Figma', 'CSS'],
        projects: ['landing-page', 'brand-identity'],
        preferences: ['visual', 'creative', 'modern']
      },
      {
        id: 'marketer1',
        role: 'marketer',
        skills: ['content', 'analytics', 'social-media'],
        projects: ['campaign', 'newsletter'],
        preferences: ['engaging', 'conversion-focused', 'branded']
      }
    ];

    const availableTemplates = [
      { id: 'react-component', type: 'code', tags: ['react', 'javascript', 'component'] },
      { id: 'landing-page', type: 'design', tags: ['landing', 'conversion', 'modern'] },
      { id: 'email-newsletter', type: 'marketing', tags: ['email', 'newsletter', 'engagement'] },
      { id: 'api-documentation', type: 'code', tags: ['api', 'documentation', 'technical'] },
      { id: 'brand-guidelines', type: 'design', tags: ['brand', 'guidelines', 'visual'] },
      { id: 'social-media-post', type: 'marketing', tags: ['social', 'content', 'engagement'] }
    ];

    for (const userProfile of userProfiles) {
      console.log(`\nGenerating recommendations for: ${userProfile.role}`);
      
      const recommendations = await this.generatePersonalizedRecommendations(
        userProfile, 
        availableTemplates
      );
      
      console.log('Personalized Recommendations:');
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec.template.id} (${rec.confidence}% match)`);
        console.log(`     Reason: ${rec.reason}`);
      });
    }
  }
}

/**
 * Simulated ML Model for Personalization
 */
class SimulatedMLModel {
  async analyze(options) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const { input, context } = options;
    
    if (context && context.userId) {
      // User behavior analysis
      const actions = input;
      const technicalActions = actions.filter(a => ['download', 'api-example', 'documentation'].includes(a.element || a.file || a.page)).length;
      const creativeActions = actions.filter(a => ['preview', 'favorite', 'share'].includes(a.type)).length;
      
      return {
        preferences: technicalActions > creativeActions ? ['technical', 'code-focused'] : ['creative', 'visual'],
        behaviorPatterns: ['explorer', 'researcher'],
        contentPreferences: ['detailed', 'examples'],
        interactionStyle: technicalActions > creativeActions ? 'analytical' : 'exploratory'
      };
    }
    
    return { analysis: 'default' };
  }

  async generate(options) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { prompt, context } = options;
    
    if (prompt.includes('personalize')) {
      const userProfile = context.userProfile;
      
      if (userProfile.preferences.includes('technical')) {
        return `
          <div class="technical-dashboard">
            <h1>{{title}}</h1>
            <div class="code-examples">{{content}}</div>
            <div class="api-docs">{{actions}}</div>
          </div>
        `;
      } else {
        return `
          <div class="visual-dashboard">
            <h1>{{title}}</h1>
            <div class="visual-content">{{content}}</div>
            <div class="interactive-elements">{{actions}}</div>
          </div>
        `;
      }
    }
    
    return '<div class="default-template">{{content}}</div>';
  }

  async predict(options) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      engagementLevel: 'high',
      purchaseIntent: Math.floor(Math.random() * 40) + 60,
      preferredContent: 'detailed',
      recommendedActions: ['view-specs', 'read-reviews', 'add-to-cart']
    };
  }
}

/**
 * User Behavior Analyzer
 */
class UserBehaviorAnalyzer {
  constructor(mlModel) {
    this.mlModel = mlModel;
    this.userProfiles = new Map();
    this.behaviorData = [];
  }

  async analyzeUserBehavior(userId, actions) {
    const analysis = await this.mlModel.analyze({
      input: actions,
      context: { userId, historicalData: this.getUserHistory(userId) }
    });

    const userProfile = this.buildUserProfile(analysis);
    this.userProfiles.set(userId, userProfile);

    return userProfile;
  }

  async generatePersonalizedTemplate(userId, baseTemplate) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return baseTemplate;

    const personalizedTemplate = await this.mlModel.generate({
      prompt: `Personalize this template for user: ${JSON.stringify(userProfile)}`,
      context: {
        baseTemplate: baseTemplate,
        userProfile: userProfile,
        personalizationPreferences: userProfile.preferences
      }
    });

    return personalizedTemplate;
  }

  buildUserProfile(analysis) {
    return {
      preferences: analysis.preferences || ['general'],
      behaviorPatterns: analysis.behaviorPatterns || ['standard'],
      contentPreferences: analysis.contentPreferences || ['balanced'],
      interactionStyle: analysis.interactionStyle || 'standard'
    };
  }

  getUserHistory(userId) {
    return [
      { action: 'page_view', page: 'home', timestamp: Date.now() - 86400000 },
      { action: 'search', query: 'templates', timestamp: Date.now() - 43200000 }
    ];
  }
}

/**
 * Context-Aware Templates
 */
class ContextAwareTemplates {
  constructor(mlModel) {
    this.mlModel = mlModel;
    this.contextRules = new Map();
  }

  async adaptToContext(template, context) {
    const contextAnalysis = await this.analyzeContext(context);
    
    const adaptedTemplate = await this.mlModel.generate({
      prompt: `Adapt template for context: ${JSON.stringify(contextAnalysis)}`,
      context: {
        originalTemplate: template,
        context: contextAnalysis,
        adaptationRules: this.getContextRules(context.type)
      }
    });

    return adaptedTemplate;
  }

  async analyzeContext(context) {
    const analysis = await this.mlModel.analyze({
      input: context,
      context: { contextRules: this.contextRules }
    });

    return {
      type: this.determineContextType(context),
      adaptations: this.determineAdaptations(context),
      priority: this.calculatePriority(context)
    };
  }

  determineContextType(context) {
    if (context.device === 'mobile') return 'mobile-optimized';
    if (context.userIntent === 'research') return 'information-focused';
    if (context.userIntent === 'comparison') return 'comparison-focused';
    return 'standard';
  }

  determineAdaptations(context) {
    const adaptations = [];
    
    if (context.device === 'mobile') {
      adaptations.push('simplified-layout', 'touch-friendly', 'reduced-content');
    }
    
    if (context.userIntent === 'research') {
      adaptations.push('detailed-information', 'specifications', 'comparison-tools');
    }
    
    if (context.userIntent === 'comparison') {
      adaptations.push('side-by-side', 'feature-matrix', 'decision-support');
    }
    
    return adaptations;
  }

  calculatePriority(context) {
    let priority = 'medium';
    
    if (context.userIntent === 'purchase') priority = 'high';
    if (context.timeOfDay === 'evening') priority = 'low';
    
    return priority;
  }

  getContextRules(contextType) {
    return {
      'mobile-optimized': { maxWidth: '100%', touchTargets: true },
      'information-focused': { detailed: true, links: true },
      'comparison-focused': { comparison: true, features: true }
    };
  }
}

/**
 * Real-Time Personalizer
 */
class RealTimePersonalizer {
  constructor(mlModel) {
    this.mlModel = mlModel;
    this.sessionCache = new Map();
  }

  async analyzeSession(userSession) {
    const realTimeProfile = await this.mlModel.predict({
      input: userSession,
      context: { sessionType: 'real-time' }
    });

    this.sessionCache.set(userSession.userId, {
      profile: realTimeProfile,
      session: userSession,
      timestamp: Date.now()
    });

    return realTimeProfile;
  }

  async generateRealTimeTemplate(userSession) {
    const sessionData = this.sessionCache.get(userSession.userId);
    if (!sessionData) return '<div class="default">Loading...</div>';

    const template = await this.mlModel.generate({
      prompt: `Generate real-time template for session: ${JSON.stringify(sessionData)}`,
      context: {
        session: sessionData.session,
        profile: sessionData.profile
      }
    });

    return template;
  }

  async updatePersonalization(userSession) {
    const sessionData = this.sessionCache.get(userSession.userId);
    if (!sessionData) return { type: 'error', description: 'Session not found' };

    // Simulate real-time updates based on user interactions
    const latestInteraction = userSession.interactions[userSession.interactions.length - 1];
    
    let updateType = 'engagement';
    let description = 'User engagement detected';
    
    if (latestInteraction.element === 'add-to-cart') {
      updateType = 'purchase-intent';
      description = 'High purchase intent detected';
    } else if (latestInteraction.type === 'scroll') {
      updateType = 'content-exploration';
      description = 'User exploring content';
    }

    return { type: updateType, description };
  }
}

/**
 * Template Recommendation Engine
 */
async function generatePersonalizedRecommendations(userProfile, availableTemplates) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const recommendations = [];
  
  for (const template of availableTemplates) {
    let confidence = 0;
    let reason = '';
    
    // Calculate match based on user profile
    if (userProfile.role === 'developer' && template.type === 'code') {
      confidence += 40;
      reason = 'Matches developer role and code focus';
    }
    
    if (userProfile.role === 'designer' && template.type === 'design') {
      confidence += 40;
      reason = 'Matches designer role and visual focus';
    }
    
    if (userProfile.role === 'marketer' && template.type === 'marketing') {
      confidence += 40;
      reason = 'Matches marketer role and engagement focus';
    }
    
    // Check skill matches
    const skillMatches = userProfile.skills.filter(skill => 
      template.tags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
    ).length;
    
    confidence += skillMatches * 15;
    if (skillMatches > 0) {
      reason += `, matches ${skillMatches} skills`;
    }
    
    // Check preference matches
    const preferenceMatches = userProfile.preferences.filter(pref => 
      template.tags.some(tag => tag.toLowerCase().includes(pref.toLowerCase()))
    ).length;
    
    confidence += preferenceMatches * 10;
    if (preferenceMatches > 0) {
      reason += `, aligns with preferences`;
    }
    
    if (confidence > 0) {
      recommendations.push({
        template,
        confidence: Math.min(confidence, 100),
        reason: reason || 'General recommendation'
      });
    }
  }
  
  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

// Run the demo if this file is executed directly
if (require.main === module) {
  const demo = new PersonalizedTemplates();
  demo.run().catch(console.error);
}

module.exports = {
  PersonalizedTemplates,
  SimulatedMLModel,
  UserBehaviorAnalyzer,
  ContextAwareTemplates,
  RealTimePersonalizer
};
