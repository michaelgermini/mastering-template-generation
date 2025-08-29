/**
 * Advanced Template Engine Example
 * Demonstrates conditional logic and loops in templates
 */

class AdvancedTemplateEngine {
  constructor() {
    this.delimiters = {
      start: '{{',
      end: '}}'
    };
  }

  /**
   * Renders a template with advanced features
   * @param {string} template - The template string
   * @param {object} data - The data object
   * @returns {string} - The rendered template
   */
  render(template, data) {
    let result = template;
    
    // Handle conditionals: {{#if condition}}...{{else}}...{{/if}}
    result = this.processConditionals(result, data);
    
    // Handle loops: {{#each array}}...{{/each}}
    result = this.processLoops(result, data);
    
    // Handle simple variables
    result = this.processVariables(result, data);
    
    return result;
  }

  /**
   * Process conditional blocks
   */
  processConditionals(template, data) {
    const conditionalRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g;
    
    return template.replace(conditionalRegex, (match, condition, trueBlock, falseBlock) => {
      const value = this.getNestedValue(data, condition);
      return value ? trueBlock : (falseBlock || '');
    });
  }

  /**
   * Process loop blocks
   */
  processLoops(template, data) {
    const loopRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    
    return template.replace(loopRegex, (match, arrayName, loopTemplate) => {
      const array = this.getNestedValue(data, arrayName);
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        let itemTemplate = loopTemplate;
        // Replace variables within the loop context
        itemTemplate = this.processVariables(itemTemplate, item);
        return itemTemplate;
      }).join('');
    });
  }

  /**
   * Process simple variable replacement
   */
  processVariables(template, data) {
    return template.replace(
      new RegExp(`${this.escapeRegex(this.delimiters.start)}(\\w+)${this.escapeRegex(this.delimiters.end)}`, 'g'),
      (match, key) => {
        const value = this.getNestedValue(data, key);
        return value !== undefined ? value : match;
      }
    );
  }

  /**
   * Get nested object value using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Escapes special regex characters
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Example usage
const engine = new AdvancedTemplateEngine();

// Example 1: Conditional rendering
console.log('=== Example 1: Conditional Rendering ===');
const conditionalTemplate = `
User Profile: {{name}}
{{#if premium}}
  ⭐ Premium Member - You have access to exclusive features!
{{else}}
  💡 Upgrade to premium for exclusive features.
{{/if}}
{{#if notifications}}
  🔔 You have {{notification_count}} new notifications.
{{/if}}
`;

const userData1 = {
  name: "Alice Johnson",
  premium: true,
  notifications: true,
  notification_count: 5
};

const userData2 = {
  name: "Bob Smith",
  premium: false,
  notifications: false
};

console.log('Template:', conditionalTemplate);
console.log('\n--- Premium User ---');
console.log('Data:', userData1);
console.log('Output:', engine.render(conditionalTemplate, userData1));
console.log('\n--- Regular User ---');
console.log('Data:', userData2);
console.log('Output:', engine.render(conditionalTemplate, userData2));
console.log();

// Example 2: Loop rendering
console.log('=== Example 2: Loop Rendering ===');
const loopTemplate = `
Shopping Cart
=============
{{#each items}}
  - {{name}} ({{quantity}}x) - ${{price}}
{{/each}}
{{#if items}}
  Total: ${{total}}
{{else}}
  Your cart is empty.
{{/if}}
`;

const cartData = {
  items: [
    { name: "Laptop", quantity: 1, price: "999.99" },
    { name: "Mouse", quantity: 2, price: "29.99" },
    { name: "Keyboard", quantity: 1, price: "89.99" }
  ],
  total: "1149.96"
};

const emptyCartData = {
  items: [],
  total: "0.00"
};

console.log('Template:', loopTemplate);
console.log('\n--- Full Cart ---');
console.log('Data:', cartData);
console.log('Output:', engine.render(loopTemplate, cartData));
console.log('\n--- Empty Cart ---');
console.log('Data:', emptyCartData);
console.log('Output:', engine.render(loopTemplate, emptyCartData));
console.log();

// Example 3: Complex template with nested data
console.log('=== Example 3: Complex Template ===');
const complexTemplate = `
Employee Directory
==================
{{#each employees}}
  Name: {{name}}
  Department: {{department}}
  {{#if manager}}
    Manager: {{manager.name}}
  {{/if}}
  Skills: {{#each skills}}{{name}}{{#unless @last}}, {{/unless}}{{/each}}
  {{#if active}}
    ✅ Active Employee
  {{else}}
    ❌ Inactive Employee
  {{/if}}
  ---
{{/each}}
`;

const companyData = {
  employees: [
    {
      name: "John Doe",
      department: "Engineering",
      manager: { name: "Jane Smith" },
      skills: [
        { name: "JavaScript" },
        { name: "Python" },
        { name: "React" }
      ],
      active: true
    },
    {
      name: "Alice Brown",
      department: "Marketing",
      skills: [
        { name: "SEO" },
        { name: "Content Writing" }
      ],
      active: false
    }
  ]
};

console.log('Template:', complexTemplate);
console.log('Data:', JSON.stringify(companyData, null, 2));
console.log('Output:', engine.render(complexTemplate, companyData));

module.exports = AdvancedTemplateEngine;
