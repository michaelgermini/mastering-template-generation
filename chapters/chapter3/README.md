# Chapter 3: Templates for the Web

Web templates are the foundation of dynamic web applications. They allow developers to create reusable HTML structures that can be populated with data from databases, APIs, or user input. This chapter explores how templates are used in web development, from simple HTML templating to modern framework components.

## HTML Templating Fundamentals

### Server-Side Rendering (SSR)

Server-side rendering generates HTML on the server before sending it to the client. This approach provides better SEO, faster initial page loads, and works well with search engines.

**Advantages:**
- Better SEO performance
- Faster initial page load
- Works without JavaScript
- Better for content-heavy sites

**Disadvantages:**
- More server resources
- Slower subsequent page loads
- Less interactive

### Client-Side Rendering (CSR)

Client-side rendering generates HTML in the browser using JavaScript. The server sends data (usually JSON) and the client-side framework handles the rendering.

**Advantages:**
- Highly interactive
- Faster subsequent page loads
- Better for single-page applications
- Rich user experience

**Disadvantages:**
- Poorer SEO (without SSR)
- Slower initial load
- Requires JavaScript

## Template Engines for Web Development

### 1. **EJS (Embedded JavaScript)**

EJS is a simple templating language that lets you embed JavaScript code in your HTML.

**Features:**
- Full JavaScript power
- Simple syntax
- Great for Node.js applications
- Includes and layouts

**Example:**
```html
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1><%= title %></h1>
  
  <% if (users.length > 0) { %>
    <ul>
      <% users.forEach(function(user) { %>
        <li><%= user.name %> - <%= user.email %></li>
      <% }); %>
    </ul>
  <% } else { %>
    <p>No users found.</p>
  <% } %>
  
  <%- include('footer') %>
</body>
</html>
```

### 2. **Pug (formerly Jade)**

Pug uses indentation-based syntax to create clean, readable templates.

**Features:**
- Minimal syntax
- Automatic HTML escaping
- Mixins for reusability
- Built-in filters

**Example:**
```pug
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  
  body
    h1= title
    
    if users.length > 0
      ul
        each user in users
          li= user.name + ' - ' + user.email
    else
      p No users found
    
    include footer
```

### 3. **Handlebars**

Handlebars provides a logic-less templating system with powerful helpers and partials.

**Features:**
- Logic-less templates
- Built-in helpers
- Partials for reusability
- Precompilation support

**Example:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
</head>
<body>
  <h1>{{title}}</h1>
  
  {{#if users}}
    <ul>
      {{#each users}}
        <li>{{name}} - {{email}}</li>
      {{/each}}
    </ul>
  {{else}}
    <p>No users found.</p>
  {{/if}}
  
  {{> footer}}
</body>
</html>
```

## Modern Framework Templates

### 1. **React JSX**

JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.

**Features:**
- Component-based architecture
- Virtual DOM for performance
- Rich ecosystem
- TypeScript support

**Example:**
```jsx
import React from 'react';

function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {user.isAdmin && <span className="admin-badge">Admin</span>}
    </div>
  );
}

function UserList({ users }) {
  return (
    <div className="user-list">
      <h1>Users</h1>
      {users.length > 0 ? (
        <div className="users-grid">
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
```

### 2. **Vue.js Templates**

Vue.js provides a template syntax that extends HTML with special directives.

**Features:**
- Declarative rendering
- Two-way data binding
- Component system
- Single-file components

**Example:**
```vue
<template>
  <div class="user-list">
    <h1>{{ title }}</h1>
    
    <div v-if="users.length > 0" class="users-grid">
      <div 
        v-for="user in users" 
        :key="user.id" 
        class="user-card"
      >
        <img :src="user.avatar" :alt="user.name">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <span v-if="user.isAdmin" class="admin-badge">Admin</span>
      </div>
    </div>
    
    <p v-else>No users found.</p>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  props: {
    users: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: 'Users'
    }
  }
}
</script>
```

### 3. **Angular Templates**

Angular uses a powerful template syntax with directives and pipes.

**Features:**
- Structural directives
- Attribute directives
- Pipes for data transformation
- Two-way binding

**Example:**
```html
<div class="user-list">
  <h1>{{ title }}</h1>
  
  <div *ngIf="users.length > 0" class="users-grid">
    <div 
      *ngFor="let user of users; trackBy: trackByUserId" 
      class="user-card"
    >
      <img [src]="user.avatar" [alt]="user.name">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <span *ngIf="user.isAdmin" class="admin-badge">Admin</span>
    </div>
  </div>
  
  <p *ngIf="users.length === 0">No users found.</p>
</div>
```

## Template Patterns and Best Practices

### 1. **Component-Based Architecture**

Break down templates into reusable components:

```jsx
// Header component
function Header({ title, user }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      {user && <UserMenu user={user} />}
    </header>
  );
}

// User menu component
function UserMenu({ user }) {
  return (
    <div className="user-menu">
      <span>Welcome, {user.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### 2. **Conditional Rendering**

Handle different states gracefully:

```jsx
function DataTable({ data, loading, error }) {
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  if (!data || data.length === 0) {
    return <EmptyState message="No data available" />;
  }
  
  return (
    <table>
      {/* table content */}
    </table>
  );
}
```

### 3. **Template Inheritance**

Use layout templates for consistent structure:

```html
<!-- layout.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}{% endblock %}</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <header>{% include 'header.html' %}</header>
  
  <main>
    {% block content %}{% endblock %}
  </main>
  
  <footer>{% include 'footer.html' %}</footer>
</body>
</html>

<!-- page.html -->
{% extends "layout.html" %}
{% block title %}User List{% endblock %}
{% block content %}
  <h1>Users</h1>
  <!-- page content -->
{% endblock %}
```

## CMS Integration

### 1. **WordPress Templates**

WordPress uses PHP templates with a hierarchical system:

```php
<?php
// header.php
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <title><?php wp_title('|', true, 'right'); ?></title>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<?php
// index.php
get_header();
?>

<main>
  <?php if (have_posts()) : ?>
    <?php while (have_posts()) : the_post(); ?>
      <article>
        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <div class="content"><?php the_content(); ?></div>
      </article>
    <?php endwhile; ?>
  <?php else : ?>
    <p>No posts found.</p>
  <?php endif; ?>
</main>

<?php
get_footer();
?>
```

### 2. **Drupal Templates**

Drupal uses Twig templates with a theme system:

```twig
{# page.html.twig #}
<!DOCTYPE html>
<html{{ attributes }}>
  <head>
    <head-placeholder token="{{ placeholder_token }}">
    <title>{{ head_title|safe_join(' | ') }}</title>
    <css-placeholder token="{{ placeholder_token }}">
    <js-placeholder token="{{ placeholder_token }}">
  </head>
  <body{{ attributes }}>
    <div id="page">
      <header>
        {{ page.header }}
      </header>
      
      <main>
        {{ page.content }}
      </main>
      
      <footer>
        {{ page.footer }}
      </footer>
    </div>
  </body>
</html>
```

## Performance Optimization

### 1. **Template Caching**

Cache compiled templates to avoid recompilation:

```javascript
// Express.js with EJS
const ejs = require('ejs');
const templateCache = new Map();

function renderTemplate(templateName, data) {
  if (!templateCache.has(templateName)) {
    const template = ejs.compile(fs.readFileSync(`views/${templateName}.ejs`, 'utf8'));
    templateCache.set(templateName, template);
  }
  
  return templateCache.get(templateName)(data);
}
```

### 2. **Lazy Loading**

Load templates only when needed:

```jsx
// React lazy loading
const UserList = React.lazy(() => import('./UserList'));
const ProductList = React.lazy(() => import('./ProductList'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Route path="/users" component={UserList} />
      <Route path="/products" component={ProductList} />
    </Suspense>
  );
}
```

### 3. **Code Splitting**

Split templates into smaller chunks:

```javascript
// Webpack with dynamic imports
const loadTemplate = async (templateName) => {
  const module = await import(`./templates/${templateName}.js`);
  return module.default;
};
```

## Security Considerations

### 1. **XSS Prevention**

Always escape user input:

```html
<!-- Safe -->
<p>{{ user_input }}</p>

<!-- Dangerous -->
<p>{{{ user_input }}}</p>
```

### 2. **Template Injection Prevention**

Validate and sanitize template data:

```javascript
// Validate template data
function validateTemplateData(data) {
  const schema = {
    title: 'string',
    users: 'array'
  };
  
  return validateSchema(data, schema);
}
```

### 3. **Content Security Policy**

Implement CSP headers:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

## Responsive Design with Templates

### 1. **Mobile-First Approach**

Design templates for mobile devices first:

```css
/* Mobile styles */
.user-card {
  width: 100%;
  margin-bottom: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .users-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .users-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 2. **Progressive Enhancement**

Ensure templates work without JavaScript:

```html
<!-- Works without JS -->
<div class="user-list">
  <h1>Users</h1>
  <div class="users-grid">
    <!-- Server-rendered content -->
  </div>
</div>

<!-- Enhanced with JS -->
<script>
  // Add interactivity
  document.querySelectorAll('.user-card').forEach(card => {
    card.addEventListener('click', handleCardClick);
  });
</script>
```

## Next Steps

In the next chapter, we'll explore how templates are used for document generation, including PDFs, Word documents, and email templates.

---

**Exercise**: Create a responsive product catalog template that works on mobile, tablet, and desktop devices. Include filtering and sorting functionality.
