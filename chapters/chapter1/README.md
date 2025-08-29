# Chapter 1: Understanding the Logic of Templates

## What is a Template?

A template is a predefined structure containing **placeholders** (also called variables, tokens, or interpolation points) that can be replaced dynamically with data. Think of it as a blueprint that defines the structure and format, while the actual content is injected at runtime.

### Core Concepts

- **Template**: The blueprint with placeholders
- **Data/Context**: The actual values to inject
- **Engine**: The processor that combines template + data
- **Output**: The final rendered result

## Why Templates?

### 1. **Reusability**
Templates allow you to create one structure and reuse it with different data:

```javascript
// Instead of writing this for each user:
console.log("Hello, Alice! Your order #12345 will be delivered on 2025-01-15");
console.log("Hello, Bob! Your order #12346 will be delivered on 2025-01-16");

// You create one template:
const template = "Hello, {{name}}! Your order #{{order_id}} will be delivered on {{delivery_date}}";
```

### 2. **Productivity**
Templates eliminate repetitive code writing and reduce development time.

### 3. **Consistency**
Ensures uniform formatting and structure across all generated content.

### 4. **Separation of Concerns**
Keeps presentation logic separate from business logic.

## Template Syntax Examples

### Basic Variable Replacement

**Template:**
```text
Hello, {{name}}!
Your order #{{order_id}} will be delivered on {{delivery_date}}.
```

**Data:**
```json
{
  "name": "Alice",
  "order_id": "34982",
  "delivery_date": "August 25, 2025"
}
```

**Output:**
```text
Hello, Alice!
Your order #34982 will be delivered on August 25, 2025.
```

### Conditional Logic

**Template:**
```text
Hello, {{name}}!
{{#if premium}}
  Welcome back, premium member! You have exclusive benefits.
{{else}}
  Upgrade to premium for exclusive benefits.
{{/if}}
```

### Loops and Iteration

**Template:**
```html
<ul>
{{#each items}}
  <li>{{name}} - ${{price}}</li>
{{/each}}
</ul>
```

## Template Types

### 1. **String Templates**
Simple text replacement with variables.

### 2. **HTML Templates**
Generate web pages and components.

### 3. **Code Templates**
Generate source code files and boilerplate.

### 4. **Document Templates**
Create PDFs, Word documents, emails.

## Hands-On Examples

### Example 1: Simple String Template

```javascript
// Basic template function
function simpleTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
}

// Usage
const template = "Hello, {{name}}! Welcome to {{company}}.";
const data = { name: "John", company: "TechCorp" };
const result = simpleTemplate(template, data);
console.log(result); // "Hello, John! Welcome to TechCorp."
```

### Example 2: HTML Template

```html
<!-- user-card.html -->
<div class="user-card">
  <img src="{{avatar}}" alt="{{name}}" class="avatar">
  <h3>{{name}}</h3>
  <p>{{email}}</p>
  <div class="badges">
    {{#each badges}}
      <span class="badge badge-{{type}}">{{name}}</span>
    {{/each}}
  </div>
</div>
```

### Example 3: Email Template

```html
<!-- welcome-email.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to {{app_name}}</title>
</head>
<body>
  <h1>Welcome, {{user_name}}!</h1>
  <p>Thank you for joining {{app_name}}. Here's what you can do next:</p>
  <ul>
    {{#each next_steps}}
      <li>{{description}}</li>
    {{/each}}
  </ul>
  <p>Best regards,<br>The {{app_name}} Team</p>
</body>
</html>
```

## Template Processing Flow

1. **Parse**: Read the template and identify placeholders
2. **Validate**: Check if required data is available
3. **Transform**: Replace placeholders with actual data
4. **Output**: Generate the final result

## Common Template Patterns

### 1. **Mustache-style** `{{variable}}`
- Used by Mustache, Handlebars, many modern engines
- Simple and readable

### 2. **ERB-style** `<%= variable %>`
- Used by EJS, ERB (Ruby)
- Allows embedded code execution

### 3. **Jinja-style** `{{ variable }}`
- Used by Jinja2, Twig
- Python-inspired syntax

### 4. **PHP-style** `<?php echo $variable; ?>`
- Native PHP templating
- Full programming language access

## Best Practices for Template Design

1. **Keep it Simple**: Avoid complex logic in templates
2. **Use Descriptive Names**: Make placeholders self-explanatory
3. **Provide Defaults**: Handle missing data gracefully
4. **Escape Output**: Prevent XSS and injection attacks
5. **Document Structure**: Comment complex template sections

## Next Steps

In the next chapter, we'll explore specific template engines and their features, learning how to use them effectively in different programming environments.

---

**Exercise**: Try creating a simple template for a product catalog item. Include fields for name, price, description, and availability status.
