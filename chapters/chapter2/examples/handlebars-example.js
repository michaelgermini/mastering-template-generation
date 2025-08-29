/**
 * Handlebars Template Engine Example
 * Demonstrates Handlebars features including helpers, partials, and conditionals
 */

const Handlebars = require('handlebars');

// Register custom helpers
Handlebars.registerHelper('formatDate', function(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

Handlebars.registerHelper('formatCurrency', function(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
});

Handlebars.registerHelper('pluralize', function(count, singular, plural) {
  return count === 1 ? singular : plural;
});

Handlebars.registerHelper('truncate', function(text, length) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
});

// Register partials
Handlebars.registerPartial('userCard', `
<div class="user-card">
  <img src="{{avatar}}" alt="{{name}}" class="avatar">
  <div class="user-info">
    <h3>{{name}}</h3>
    <p class="email">{{email}}</p>
    <p class="role">{{role}}</p>
    {{#if isAdmin}}
      <span class="admin-badge">👑 Admin</span>
    {{/if}}
  </div>
</div>
`);

Handlebars.registerPartial('productCard', `
<div class="product-card">
  <img src="{{image}}" alt="{{name}}" class="product-image">
  <div class="product-info">
    <h3>{{name}}</h3>
    <p class="description">{{truncate description 100}}</p>
    <p class="price">{{formatCurrency price}}</p>
    {{#if onSale}}
      <span class="sale-badge">SALE!</span>
      <p class="original-price">Was: {{formatCurrency originalPrice}}</p>
    {{/if}}
    <button class="add-to-cart">Add to Cart</button>
  </div>
</div>
`);

// Main templates
const userListTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
  <style>
    .user-card {
      border: 1px solid #ddd;
      padding: 15px;
      margin: 10px;
      border-radius: 8px;
      display: flex;
      align-items: center;
    }
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 15px;
    }
    .admin-badge {
      background: #ff6b6b;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    .stats {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>{{title}}</h1>
  
  <div class="stats">
    <p>Total Users: {{users.length}}</p>
    <p>Admins: {{#each users}}{{#if isAdmin}}{{@index}}{{/if}}{{/each}}</p>
    <p>Last Updated: {{formatDate lastUpdated}}</p>
  </div>

  {{#if users}}
    <div class="users-grid">
      {{#each users}}
        {{> userCard}}
      {{/each}}
    </div>
  {{else}}
    <p>No users found.</p>
  {{/if}}
</body>
</html>
`;

const productCatalogTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
  <style>
    .product-card {
      border: 1px solid #ddd;
      padding: 15px;
      margin: 10px;
      border-radius: 8px;
      max-width: 300px;
    }
    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
    }
    .sale-badge {
      background: #ff6b6b;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    .original-price {
      text-decoration: line-through;
      color: #999;
    }
    .price {
      font-size: 18px;
      font-weight: bold;
      color: #2ecc71;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
  </style>
</head>
<body>
  <h1>{{title}}</h1>
  
  <div class="catalog-stats">
    <p>Total Products: {{products.length}}</p>
    <p>On Sale: {{#each products}}{{#if onSale}}{{@index}}{{/if}}{{/each}}</p>
    <p>Average Price: {{formatCurrency averagePrice}}</p>
  </div>

  {{#if products}}
    <div class="products-grid">
      {{#each products}}
        {{> productCard}}
      {{/each}}
    </div>
  {{else}}
    <p>No products available.</p>
  {{/if}}
</body>
</html>
`;

// Sample data
const userData = {
  title: "User Directory",
  lastUpdated: new Date(),
  users: [
    {
      name: "Alice Johnson",
      email: "alice@company.com",
      role: "Senior Developer",
      avatar: "https://via.placeholder.com/60/3498db/ffffff?text=A",
      isAdmin: true
    },
    {
      name: "Bob Smith",
      email: "bob@company.com",
      role: "Product Manager",
      avatar: "https://via.placeholder.com/60/e74c3c/ffffff?text=B",
      isAdmin: false
    },
    {
      name: "Carol Davis",
      email: "carol@company.com",
      role: "UX Designer",
      avatar: "https://via.placeholder.com/60/2ecc71/ffffff?text=C",
      isAdmin: false
    }
  ]
};

const productData = {
  title: "Product Catalog",
  averagePrice: 299.99,
  products: [
    {
      name: "Premium Laptop",
      description: "High-performance laptop with the latest specifications and premium build quality. Perfect for professionals and power users who demand the best performance.",
      price: 1299.99,
      image: "https://via.placeholder.com/300/3498db/ffffff?text=Laptop",
      onSale: false
    },
    {
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision tracking and long battery life.",
      price: 49.99,
      originalPrice: 79.99,
      image: "https://via.placeholder.com/300/e74c3c/ffffff?text=Mouse",
      onSale: true
    },
    {
      name: "Mechanical Keyboard",
      description: "Premium mechanical keyboard with customizable RGB lighting and tactile switches.",
      price: 199.99,
      image: "https://via.placeholder.com/300/2ecc71/ffffff?text=Keyboard",
      onSale: false
    }
  ]
};

// Compile and render templates
function renderUserList() {
  const template = Handlebars.compile(userListTemplate);
  return template(userData);
}

function renderProductCatalog() {
  const template = Handlebars.compile(productCatalogTemplate);
  return template(productData);
}

// Example usage
console.log('=== Handlebars User List Example ===');
console.log(renderUserList());

console.log('\n=== Handlebars Product Catalog Example ===');
console.log(renderProductCatalog());

// Export for use in other examples
module.exports = {
  renderUserList,
  renderProductCatalog,
  Handlebars
};
