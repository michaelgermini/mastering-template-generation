# Chapter 2: Template Engines

Template engines are specialized libraries that process templates and generate output by replacing placeholders with actual data. Different programming ecosystems have their own popular template engines, each with unique features and syntax.

## Popular Template Engines

### JavaScript/Node.js Ecosystem

#### 1. **Mustache** - Logic-less Templates
Mustache is a logic-less template engine that emphasizes simplicity and separation of concerns.

**Features:**
- No programming logic in templates
- Cross-language compatibility
- Simple syntax
- Great for content-focused templates

**Syntax:**
```html
<h1>{{title}}</h1>
{{#users}}
  <div class="user">
    <h2>{{name}}</h2>
    <p>{{email}}</p>
  </div>
{{/users}}
{{^users}}
  <p>No users found.</p>
{{/users}}
```

#### 2. **Handlebars** - Mustache with Extensions
Handlebars extends Mustache with additional features like helpers and partials.

**Features:**
- Built-in helpers (`{{#if}}`, `{{#each}}`, `{{#unless}}`)
- Custom helpers
- Partials (reusable template fragments)
- Precompilation for performance

**Syntax:**
```html
{{#each products}}
  <div class="product-card">
    <h3>{{name}}</h3>
    <p class="price">${{price}}</p>
    {{#if onSale}}
      <span class="sale-badge">SALE!</span>
    {{/if}}
  </div>
{{/each}}
```

#### 3. **EJS (Embedded JavaScript)** - Full JavaScript Power
EJS allows you to embed JavaScript directly in your templates.

**Features:**
- Full JavaScript execution
- Includes and layouts
- Filters and custom functions
- High performance

**Syntax:**
```html
<h1><%= title %></h1>
<% if (users.length > 0) { %>
  <% users.forEach(function(user) { %>
    <div class="user">
      <h2><%= user.name %></h2>
      <p><%= user.email %></p>
    </div>
  <% }); %>
<% } else { %>
  <p>No users found.</p>
<% } %>
```

#### 4. **Pug** - Clean, Indentation-based Syntax
Pug (formerly Jade) uses indentation to define structure, creating very clean templates.

**Features:**
- Minimal syntax
- Automatic HTML escaping
- Mixins (reusable components)
- Built-in filters

**Syntax:**
```pug
h1= title
if users.length > 0
  each user in users
    .user
      h2= user.name
      p= user.email
else
  p No users found
```

### Python Ecosystem

#### 1. **Jinja2** - Powerful and Flexible
Jinja2 is a modern and designer-friendly template engine for Python.

**Features:**
- Rich expression language
- Template inheritance
- Macros and filters
- Auto-escaping
- Sandboxed execution

**Syntax:**
```html
<h1>{{ title }}</h1>
{% if users %}
  {% for user in users %}
    <div class="user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      {% if user.is_admin %}
        <span class="admin-badge">Admin</span>
      {% endif %}
    </div>
  {% endfor %}
{% else %}
  <p>No users found.</p>
{% endif %}
```

#### 2. **Mako** - High Performance
Mako is a fast and lightweight template engine with Python-like syntax.

**Features:**
- Python code blocks
- Template inheritance
- Caching
- Unicode support

**Syntax:**
```html
<h1>${title}</h1>
% if users:
  % for user in users:
    <div class="user">
      <h2>${user.name}</h2>
      <p>${user.email}</p>
    </div>
  % endfor
% else:
  <p>No users found.</p>
% endif
```

### PHP Ecosystem

#### 1. **Twig** - Flexible and Secure
Twig is a flexible, fast, and secure template engine for PHP.

**Features:**
- Auto-escaping
- Template inheritance
- Macros and filters
- Sandbox mode
- Extensible

**Syntax:**
```twig
<h1>{{ title }}</h1>
{% if users %}
  {% for user in users %}
    <div class="user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      {% if user.isAdmin %}
        <span class="admin-badge">Admin</span>
      {% endif %}
    </div>
  {% endfor %}
{% else %}
  <p>No users found.</p>
{% endif %}
```

## Template Engine Comparison

| Feature | Mustache | Handlebars | EJS | Pug | Jinja2 | Twig |
|---------|----------|------------|-----|-----|--------|------|
| Logic-less | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Performance | High | High | Very High | High | High | High |
| Learning Curve | Low | Low | Medium | Medium | Medium | Medium |
| Flexibility | Low | Medium | High | High | High | High |
| Security | High | High | Medium | High | High | High |

## Choosing the Right Template Engine

### Consider These Factors:

1. **Project Requirements**
   - Simple content templates → Mustache/Handlebars
   - Complex logic needed → EJS/Jinja2
   - Clean syntax preferred → Pug

2. **Team Experience**
   - Frontend developers → Handlebars/EJS
   - Python developers → Jinja2
   - PHP developers → Twig

3. **Performance Needs**
   - High-traffic applications → Precompiled templates
   - Development speed → EJS/Jinja2

4. **Security Requirements**
   - User-generated content → Auto-escaping engines
   - Sandboxed execution → Jinja2/Twig

## Template Engine Features Deep Dive

### 1. **Template Inheritance**
Allows templates to extend a base template and override specific sections.

**Example (Jinja2):**
```html
<!-- base.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}{% endblock %}</title>
</head>
<body>
  <header>{% block header %}{% endblock %}</header>
  <main>{% block content %}{% endblock %}</main>
  <footer>{% block footer %}{% endblock %}</footer>
</body>
</html>

<!-- page.html -->
{% extends "base.html" %}
{% block title %}User Profile{% endblock %}
{% block content %}
  <h1>{{ user.name }}</h1>
  <p>{{ user.email }}</p>
{% endblock %}
```

### 2. **Partials/Includes**
Reusable template fragments that can be included in multiple templates.

**Example (Handlebars):**
```html
<!-- user-card.hbs -->
<div class="user-card">
  <h3>{{name}}</h3>
  <p>{{email}}</p>
</div>

<!-- users-list.hbs -->
<h1>Users</h1>
{{#each users}}
  {{> user-card}}
{{/each}}
```

### 3. **Custom Helpers/Filters**
Extend template functionality with custom functions.

**Example (Handlebars):**
```javascript
Handlebars.registerHelper('formatDate', function(date) {
  return new Date(date).toLocaleDateString();
});

// Usage in template:
<p>Created: {{formatDate created_at}}</p>
```

### 4. **Auto-escaping**
Automatically escape output to prevent XSS attacks.

**Example (Jinja2):**
```html
<!-- This is automatically escaped -->
<p>{{ user_input }}</p>

<!-- This is not escaped (use with caution) -->
<p>{{ user_input | safe }}</p>
```

## Performance Considerations

### 1. **Template Compilation**
Pre-compile templates for better performance:

```javascript
// Handlebars
const template = Handlebars.compile(source);
const html = template(data);

// EJS
const template = ejs.compile(source);
const html = template(data);
```

### 2. **Caching**
Cache compiled templates to avoid recompilation:

```javascript
const templateCache = new Map();

function getTemplate(name) {
  if (!templateCache.has(name)) {
    const source = fs.readFileSync(`templates/${name}.hbs`, 'utf8');
    templateCache.set(name, Handlebars.compile(source));
  }
  return templateCache.get(name);
}
```

### 3. **Minimal Logic**
Keep templates focused on presentation:

```html
<!-- Good: Simple logic -->
{{#if user.isAdmin}}
  <button>Admin Panel</button>
{{/if}}

<!-- Bad: Complex business logic -->
{{#if (and user.isAdmin (gt user.permissions.length 5))}}
  <button>Advanced Admin Panel</button>
{{/if}}
```

## Security Best Practices

### 1. **Always Escape Output**
```html
<!-- Safe -->
<p>{{ user_input }}</p>

<!-- Dangerous -->
<p>{{{ user_input }}}</p>
```

### 2. **Validate Input Data**
```javascript
// Validate before rendering
const sanitizedData = {
  name: validator.escape(data.name),
  email: validator.isEmail(data.email) ? data.email : ''
};
```

### 3. **Use Sandboxed Execution**
```python
# Jinja2 sandbox
env = SandboxedEnvironment()
template = env.from_string(source)
```

## Next Steps

In the next chapter, we'll explore how these template engines are used in web development, including integration with frameworks like Express.js, Flask, and Django.

---

**Exercise**: Create a simple blog post template using your preferred template engine. Include fields for title, author, date, content, and tags.
