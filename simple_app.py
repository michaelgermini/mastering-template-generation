#!/usr/bin/env python3
"""
Simple Flask Template Generation Demo
"""

from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

# Sample data
PRODUCTS = [
    {'id': 1, 'name': 'Wireless Headphones', 'price': 199.99, 'category': 'Electronics', 'in_stock': True},
    {'id': 2, 'name': 'Ergonomic Chair', 'price': 399.99, 'category': 'Furniture', 'in_stock': True},
    {'id': 3, 'name': 'Coffee Maker', 'price': 89.99, 'category': 'Appliances', 'in_stock': False}
]

@app.route('/')
def home():
    """Home page with product catalog"""
    html = f'''<!DOCTYPE html>
<html>
<head>
    <title>🎯 Template Generation Demo</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
        .container {{ max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        h1 {{ color: #3498db; text-align: center; }}
        .product {{ border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 8px; }}
        .price {{ font-size: 18px; font-weight: bold; color: #27ae60; }}
        .in-stock {{ color: #27ae60; }}
        .out-of-stock {{ color: #e74c3c; }}
        .api-link {{ display: inline-block; background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Mastering Template Generation</h1>
        <p>Interactive Product Catalog - Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>

        <p><a href="/api/products" class="api-link">🔌 View JSON API</a></p>

        <h2>Our Products:</h2>'''

    for product in PRODUCTS:
        status_class = "in-stock" if product['in_stock'] else "out-of-stock"
        status_text = "✅ In Stock" if product['in_stock'] else "❌ Out of Stock"

        html += f'''
        <div class="product">
            <h3>{product['name']}</h3>
            <p><strong>Category:</strong> {product['category']}</p>
            <p class="price">${product['price']:.2f}</p>
            <p class="{status_class}">{status_text}</p>
            <p><a href="/product/{product['id']}">View Details</a></p>
        </div>'''

    html += '''
    </div>
</body>
</html>'''
    return html

@app.route('/api/products')
def api_products():
    """JSON API endpoint"""
    return jsonify({
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'count': len(PRODUCTS),
        'products': PRODUCTS
    })

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    """Individual product page"""
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if not product:
        return '<h1>Product Not Found</h1><p><a href="/">← Back</a></p>', 404

    status_class = "in-stock" if product['in_stock'] else "out-of-stock"
    status_text = "✅ In Stock" if product['in_stock'] else "❌ Out of Stock"

    html = f'''<!DOCTYPE html>
<html>
<head>
    <title>{product['name']} - Template Demo</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
        .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .back-link {{ color: #3498db; text-decoration: none; }}
        h1 {{ color: #2c3e50; }}
        .price {{ font-size: 24px; font-weight: bold; color: #27ae60; }}
        .{status_class} {{ font-weight: bold; }}
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← Back to Products</a>
        <h1>{product['name']}</h1>
        <p><strong>Category:</strong> {product['category']}</p>
        <p class="price">${product['price']:.2f}</p>
        <p class="{status_class}">{status_text}</p>
        <p><strong>Product ID:</strong> {product['id']}</p>
        <br>
        <p><em>Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</em></p>
    </div>
</body>
</html>'''
    return html

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'uptime': 'running'
    })

if __name__ == '__main__':
    print("🚀 Starting Simple Flask Template Demo...")
    print("📡 Visit: http://localhost:5000")
    print("🔌 API: http://localhost:5000/api/products")
    print("💚 Health: http://localhost:5000/health")
    print("Press Ctrl+C to stop")
    app.run(debug=True, host='127.0.0.1', port=5000)
