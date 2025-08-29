/**
 * Simple Template Engine Example
 * Demonstrates basic template functionality with variable replacement
 */

class SimpleTemplateEngine {
  constructor() {
    this.delimiters = {
      start: '{{',
      end: '}}'
    };
  }

  /**
   * Renders a template with provided data
   * @param {string} template - The template string with placeholders
   * @param {object} data - The data object containing values
   * @returns {string} - The rendered template
   */
  render(template, data) {
    let result = template;
    
    // Replace simple variables
    result = result.replace(
      new RegExp(`${this.escapeRegex(this.delimiters.start)}(\\w+)${this.escapeRegex(this.delimiters.end)}`, 'g'),
      (match, key) => {
        return data[key] !== undefined ? data[key] : match;
      }
    );

    return result;
  }

  /**
   * Escapes special regex characters
   * @param {string} string - String to escape
   * @returns {string} - Escaped string
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Example usage
const engine = new SimpleTemplateEngine();

// Example 1: Basic variable replacement
console.log('=== Example 1: Basic Variable Replacement ===');
const template1 = "Hello, {{name}}! Welcome to {{company}}.";
const data1 = { name: "John Doe", company: "TechCorp" };
console.log('Template:', template1);
console.log('Data:', data1);
console.log('Output:', engine.render(template1, data1));
console.log();

// Example 2: Order confirmation template
console.log('=== Example 2: Order Confirmation ===');
const orderTemplate = 
"Order Confirmation\n" +
"==================\n" +
"Customer: {{customer_name}}\n" +
"Order ID: {{order_id}}\n" +
"Total: ${{total}}\n" +
"Delivery Date: {{delivery_date}}\n" +
"Status: {{status}}\n";

const orderData = {
  customer_name: "Alice Johnson",
  order_id: "ORD-2025-001",
  total: 299.99,
  delivery_date: "January 15, 2025",
  status: "Processing"
};

console.log('Template:', orderTemplate);
console.log('Data:', orderData);
console.log('Output:', engine.render(orderTemplate, orderData));
console.log();

// Example 3: HTML template
console.log('=== Example 3: HTML Template ===');
const htmlTemplate = `
<div class="user-profile">
  <h2>{{full_name}}</h2>
  <p>Email: {{email}}</p>
  <p>Role: {{role}}</p>
  <p>Department: {{department}}</p>
</div>
`;

const userData = {
  full_name: "Sarah Wilson",
  email: "sarah.wilson@company.com",
  role: "Senior Developer",
  department: "Engineering"
};

console.log('Template:', htmlTemplate);
console.log('Data:', userData);
console.log('Output:', engine.render(htmlTemplate, userData));
console.log();

// Example 4: Missing data handling
console.log('=== Example 4: Missing Data Handling ===');
const incompleteTemplate = "Hello {{name}}, your {{item}} is ready for pickup.";
const incompleteData = { name: "Bob" }; // Missing 'item'

console.log('Template:', incompleteTemplate);
console.log('Data:', incompleteData);
console.log('Output:', engine.render(incompleteTemplate, incompleteData));
console.log('Note: Missing variables are left as-is in the template');

module.exports = SimpleTemplateEngine;
