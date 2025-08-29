/**
 * Express.js Web Application with EJS Templates
 * Demonstrates server-side rendering, template inheritance, and dynamic content
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sample data (in a real app, this would come from a database)
const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@company.com',
    role: 'Senior Developer',
    department: 'Engineering',
    avatar: '/images/avatar1.jpg',
    isAdmin: true,
    isActive: true,
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    joinedDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@company.com',
    role: 'Product Manager',
    department: 'Product',
    avatar: '/images/avatar2.jpg',
    isAdmin: false,
    isActive: true,
    skills: ['Product Strategy', 'User Research', 'Agile'],
    joinedDate: '2022-08-20'
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol@company.com',
    role: 'UX Designer',
    department: 'Design',
    avatar: '/images/avatar3.jpg',
    isAdmin: false,
    isActive: false,
    skills: ['UI/UX Design', 'Figma', 'Prototyping'],
    joinedDate: '2023-03-10'
  }
];

const products = [
  {
    id: 1,
    name: 'Premium Laptop',
    description: 'High-performance laptop with the latest specifications and premium build quality.',
    price: 1299.99,
    salePrice: 1099.99,
    category: 'Electronics',
    stock: 25,
    rating: 4.5,
    onSale: true,
    image: '/images/laptop.jpg'
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    price: 79.99,
    category: 'Accessories',
    stock: 150,
    rating: 4.2,
    onSale: false,
    image: '/images/mouse.jpg'
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    description: 'Premium mechanical keyboard with customizable RGB lighting and tactile switches.',
    price: 199.99,
    category: 'Accessories',
    stock: 50,
    rating: 4.8,
    onSale: false,
    image: '/images/keyboard.jpg'
  }
];

// Helper functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Make helpers available to all templates
app.locals.formatCurrency = formatCurrency;
app.locals.formatDate = formatDate;

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Template Generation Demo',
    users: users.slice(0, 3), // Show only first 3 users on homepage
    products: products.slice(0, 3), // Show only first 3 products on homepage
    stats: {
      totalUsers: users.length,
      totalProducts: products.length,
      activeUsers: users.filter(u => u.isActive).length
    }
  });
});

app.get('/users', (req, res) => {
  const { search, department, role } = req.query;
  
  let filteredUsers = [...users];
  
  // Apply filters
  if (search) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (department) {
    filteredUsers = filteredUsers.filter(user => 
      user.department.toLowerCase() === department.toLowerCase()
    );
  }
  
  if (role) {
    filteredUsers = filteredUsers.filter(user => 
      user.role.toLowerCase().includes(role.toLowerCase())
    );
  }
  
  res.render('users', {
    title: 'User Directory',
    users: filteredUsers,
    departments: [...new Set(users.map(u => u.department))],
    roles: [...new Set(users.map(u => u.role))],
    filters: { search, department, role }
  });
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).render('error', {
      title: 'User Not Found',
      message: 'The requested user could not be found.'
    });
  }
  
  res.render('user-detail', {
    title: `${user.name} - User Profile`,
    user
  });
});

app.get('/products', (req, res) => {
  const { search, category, minPrice, maxPrice, onSale } = req.query;
  
  let filteredProducts = [...products];
  
  // Apply filters
  if (search) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      (product.onSale ? product.salePrice : product.price) >= parseFloat(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      (product.onSale ? product.salePrice : product.price) <= parseFloat(maxPrice)
    );
  }
  
  if (onSale === 'true') {
    filteredProducts = filteredProducts.filter(product => product.onSale);
  }
  
  res.render('products', {
    title: 'Product Catalog',
    products: filteredProducts,
    categories: [...new Set(products.map(p => p.category))],
    filters: { search, category, minPrice, maxPrice, onSale }
  });
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).render('error', {
      title: 'Product Not Found',
      message: 'The requested product could not be found.'
    });
  }
  
  res.render('product-detail', {
    title: `${product.name} - Product Details`,
    product
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us'
  });
});

// API routes for AJAX requests
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The requested page could not be found.'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'Something went wrong on our end.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET  /              - Homepage');
  console.log('  GET  /users         - User directory');
  console.log('  GET  /users/:id     - User detail');
  console.log('  GET  /products      - Product catalog');
  console.log('  GET  /products/:id  - Product detail');
  console.log('  GET  /about         - About page');
  console.log('  GET  /api/users     - Users API');
  console.log('  GET  /api/products  - Products API');
});

module.exports = app;
