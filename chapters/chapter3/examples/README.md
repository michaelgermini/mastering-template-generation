# Chapter 3: Web Templates Examples

This directory contains practical examples demonstrating web templating concepts using Express.js and EJS.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start the demo server
node run-demo.js
```

The application will be available at `http://localhost:3000`

## 📁 File Structure

```
examples/
├── express-ejs-app.js      # Main Express.js application
├── run-demo.js             # Demo runner with additional features
├── views/                  # EJS template files
│   ├── layout.ejs          # Base layout template
│   ├── index.ejs           # Homepage template
│   ├── users.ejs           # User directory template
│   ├── about.ejs           # About page template
│   ├── error.ejs           # Error page template
│   └── partials/           # Reusable template components
│       ├── head.ejs        # Head section partial
│       └── scripts.ejs     # Scripts section partial
└── README.md               # This file
```

## 🎯 Features Demonstrated

### 1. Template Inheritance
- Base layout template (`layout.ejs`) defines the overall structure
- Other pages extend the layout and only provide specific content
- Consistent header, navigation, and footer across all pages

### 2. Dynamic Content Rendering
- Server-side rendering with EJS templates
- Data binding from JavaScript objects to HTML
- Conditional rendering based on data properties

### 3. Component Architecture
- Reusable partials in `views/partials/`
- Modular template components
- DRY (Don't Repeat Yourself) principles

### 4. Interactive Features
- Search and filtering functionality
- Responsive design with Bootstrap 5
- Client-side JavaScript enhancements

### 5. Error Handling
- Custom error pages for 404 and 500 errors
- Graceful error handling in templates

## 🌐 Available Routes

| Route | Description | Template |
|-------|-------------|----------|
| `/` | Homepage with featured content | `index.ejs` |
| `/users` | User directory with filtering | `users.ejs` |
| `/users/:id` | Individual user profiles | `user-detail.ejs` |
| `/products` | Product catalog with search | `products.ejs` |
| `/products/:id` | Product details | `product-detail.ejs` |
| `/about` | About page | `about.ejs` |
| `/health` | Health check endpoint | JSON response |
| `/api/demo` | Demo API endpoint | JSON response |

## 🎨 Template Examples

### Basic Template Structure
```ejs
<%- include('layout', { body: `
    <!-- Your page content here -->
    <h1>${title}</h1>
    <p>${message}</p>
` }) %>
```

### Conditional Rendering
```ejs
<% if (user.isAdmin) { %>
    <span class="badge badge-admin">Admin</span>
<% } %>
```

### Loops and Iteration
```ejs
<% users.forEach(function(user) { %>
    <div class="user-card">
        <h3>${user.name}</h3>
        <p>${user.email}</p>
    </div>
<% }); %>
```

### Form Handling
```ejs
<form method="GET" action="/users">
    <input type="text" name="search" value="${filters.search || ''}">
    <button type="submit">Search</button>
</form>
```

## 🔧 Customization

### Adding New Pages
1. Create a new EJS template in `views/`
2. Add a route in `express-ejs-app.js`
3. Use the layout template for consistency

### Styling
- CSS is included in `layout.ejs`
- Uses Bootstrap 5 for responsive design
- Custom CSS variables for theming

### Data
- Sample data is defined in `express-ejs-app.js`
- In a real application, this would come from a database
- API endpoints are available for AJAX requests

## 🧪 Testing

### Manual Testing
1. Start the server: `node run-demo.js`
2. Visit `http://localhost:3000`
3. Navigate through different pages
4. Test search and filtering functionality

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test demo API
curl http://localhost:3000/api/demo

# Test users API
curl http://localhost:3000/api/users
```

## 📚 Learning Objectives

After completing this chapter, you should understand:

1. **Template Inheritance**: How to create reusable layouts
2. **Dynamic Rendering**: How to bind data to templates
3. **Conditional Logic**: How to show/hide content based on data
4. **Component Architecture**: How to create reusable template parts
5. **Form Handling**: How to process user input in templates
6. **Error Handling**: How to handle errors gracefully
7. **Responsive Design**: How to create mobile-friendly templates

## 🔗 Related Chapters

- **Chapter 1**: Understanding the Logic of Templates
- **Chapter 2**: Template Engines
- **Chapter 4**: Templates for Documents and Emails
- **Chapter 5**: Code Generation with Templates

## 🚀 Next Steps

1. Try modifying the templates to add new features
2. Experiment with different template engines (Handlebars, Pug)
3. Add more interactive features with JavaScript
4. Integrate with a real database
5. Add user authentication and authorization

---

**Happy templating! 🎉**
