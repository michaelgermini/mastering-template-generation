/**
 * Demo Runner for Express.js EJS Template Application
 * This script demonstrates how to run the web application
 */

const express = require('express');
const path = require('path');

// Import the main application
const app = require('./express-ejs-app');

// Add some additional middleware for development
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Add a simple health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Add a demo API endpoint
app.get('/api/demo', (req, res) => {
    res.json({
        message: 'Template Generation Demo API',
        features: [
            'Server-side rendering with EJS',
            'Template inheritance',
            'Dynamic content generation',
            'Responsive design',
            'Filtering and search',
            'Component-based architecture'
        ],
        technologies: [
            'Express.js',
            'EJS Templates',
            'Bootstrap 5',
            'Font Awesome',
            'JavaScript ES6+'
        ]
    });
});

// Add error handling for development
if (process.env.NODE_ENV === 'development') {
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    });
}

// Export for testing
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
        console.log('🚀 Template Generation Demo Server Started!');
        console.log(`📍 Server running on http://localhost:${PORT}`);
        console.log('');
        console.log('📋 Available Routes:');
        console.log(`   GET  /              - Homepage with featured content`);
        console.log(`   GET  /users         - User directory with filtering`);
        console.log(`   GET  /users/:id     - Individual user profiles`);
        console.log(`   GET  /products      - Product catalog with search`);
        console.log(`   GET  /products/:id  - Product details`);
        console.log(`   GET  /about         - About page`);
        console.log(`   GET  /health        - Health check endpoint`);
        console.log(`   GET  /api/demo      - Demo API endpoint`);
        console.log(`   GET  /api/users     - Users API`);
        console.log(`   GET  /api/products  - Products API`);
        console.log('');
        console.log('🎯 Features Demonstrated:');
        console.log('   ✅ Template inheritance with layout.ejs');
        console.log('   ✅ Dynamic content rendering');
        console.log('   ✅ Conditional logic and loops');
        console.log('   ✅ Form handling and filtering');
        console.log('   ✅ Responsive design');
        console.log('   ✅ Component-based architecture');
        console.log('   ✅ Error handling');
        console.log('');
        console.log('💡 Try these URLs:');
        console.log(`   http://localhost:${PORT}/users?department=Engineering`);
        console.log(`   http://localhost:${PORT}/products?onSale=true`);
        console.log(`   http://localhost:${PORT}/api/demo`);
        console.log('');
        console.log('🛑 Press Ctrl+C to stop the server');
    });
}
