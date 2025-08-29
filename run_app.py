#!/usr/bin/env python3
"""
Standalone Flask Application for Template Generation Demo
"""

from flask import Flask, jsonify
from datetime import datetime
import json

app = Flask(__name__)

# Sample product data
PRODUCTS = [
    {
        "id": 1,
        "name": "Wireless Headphones",
        "price": 199.99,
        "category": "Electronics",
        "description": "Premium wireless headphones with noise cancellation",
        "in_stock": True,
        "rating": 4.5
    },
    {
        "id": 2,
        "name": "Ergonomic Chair",
        "price": 399.99,
        "category": "Furniture",
        "description": "Comfortable ergonomic office chair",
        "in_stock": True,
        "rating": 4.8
    },
    {
        "id": 3,
        "name": "Coffee Maker",
        "price": 89.99,
        "category": "Appliances",
        "description": "Programmable coffee maker with thermal carafe",
        "in_stock": False,
        "rating": 4.2
    }
]

def generate_home_page():
    """Generate the home page HTML"""
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎯 Mastering Template Generation</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }}
        .header p {{
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
        }}
        .content {{
            padding: 40px;
        }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }}
        .stat-card {{
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #3498db;
        }}
        .stat-number {{
            font-size: 2em;
            font-weight: bold;
            color: #3498db;
            margin: 0;
        }}
        .stat-label {{
            color: #6c757d;
            margin: 5px 0 0 0;
            font-size: 0.9em;
        }}
        .products {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }}
        .product-card {{
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        .product-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }}
        .product-header {{
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }}
        .product-name {{
            margin: 0;
            color: #2c3e50;
            font-size: 1.2em;
            font-weight: 600;
        }}
        .product-category {{
            color: #6c757d;
            font-style: italic;
            margin: 5px 0 0 0;
        }}
        .product-body {{
            padding: 20px;
        }}
        .product-price {{
            font-size: 1.5em;
            font-weight: bold;
            color: #27ae60;
            margin: 15px 0;
        }}
        .product-description {{
            color: #495057;
            line-height: 1.5;
            margin: 15px 0;
        }}
        .product-rating {{
            display: inline-block;
            background: #fff3cd;
            color: #856404;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            margin: 10px 0;
        }}
        .product-status {{
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
            margin: 10px 0;
        }}
        .in-stock {{
            background: #d4edda;
            color: #155724;
        }}
        .out-of-stock {{
            background: #f8d7da;
            color: #721c24;
        }}
        .product-actions {{
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
        }}
        .btn {{
            display: inline-block;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.9em;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-right: 10px;
        }}
        .btn-primary {{
            background: #007bff;
            color: white;
        }}
        .btn-primary:hover {{
            background: #0056b3;
        }}
        .btn-secondary {{
            background: #6c757d;
            color: white;
        }}
        .btn-secondary:hover {{
            background: #545b62;
        }}
        .footer {{
            background: #343a40;
            color: white;
            text-align: center;
            padding: 20px;
            margin-top: 40px;
        }}
        .footer p {{
            margin: 0;
            opacity: 0.8;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Mastering Template Generation</h1>
            <p>Interactive Product Catalog Demo</p>
            <p>Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
        </div>

        <div class="content">
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">{len(PRODUCTS)}</div>
                    <div class="stat-label">Total Products</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{sum(1 for p in PRODUCTS if p['in_stock'])}</div>
                    <div class="stat-label">In Stock</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{len(set(p['category'] for p in PRODUCTS))}</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${sum(p['price'] for p in PRODUCTS):.0f}</div>
                    <div class="stat-label">Total Value</div>
                </div>
            </div>

            <div class="products">
"""

    for product in PRODUCTS:
        status_class = "in-stock" if product['in_stock'] else "out-of-stock"
        status_text = "In Stock" if product['in_stock'] else "Out of Stock"
        stars = "⭐" * int(product['rating'])

        html += f"""
                <div class="product-card">
                    <div class="product-header">
                        <h3 class="product-name">{product['name']}</h3>
                        <p class="product-category">{product['category']}</p>
                    </div>
                    <div class="product-body">
                        <div class="product-price">${product['price']:.2f}</div>
                        <p class="product-description">{product['description']}</p>
                        <div class="product-rating">{stars} ({product['rating']}/5)</div>
                        <br>
                        <span class="product-status {status_class}">{status_text}</span>
                    </div>
                    <div class="product-actions">
                        <a href="/api/products" class="btn btn-primary">View API</a>
                        <a href="/product/{product['id']}" class="btn btn-secondary">View Details</a>
                    </div>
                </div>
"""

    html += """
            </div>
        </div>

        <div class="footer">
            <p>🚀 Powered by Python Flask & Template Generation</p>
            <p>Generated dynamically using Python string templates</p>
        </div>
    </div>
</body>
</html>
"""
    return html

@app.route('/')
def home():
    """Home page with product catalog"""
    return generate_home_page()

@app.route('/api/products')
def api_products():
    """JSON API endpoint"""
    return jsonify({
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'count': len(PRODUCTS),
        'data': PRODUCTS
    })

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    """Individual product page"""
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if not product:
        return f"""
        <h1>Product Not Found</h1>
        <p>The product with ID {product_id} was not found.</p>
        <a href="/">← Back to Products</a>
        """, 404

    status_class = "in-stock" if product['in_stock'] else "out-of-stock"
    status_text = "In Stock" if product['in_stock'] else "Out of Stock"
    stars = "⭐" * int(product['rating'])

    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product['name']} - Template Generation Demo</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        .back-link {{
            display: inline-block;
            color: #3498db;
            text-decoration: none;
            padding: 20px;
            font-weight: 500;
        }}
        .back-link:hover {{
            text-decoration: underline;
        }}
        .product-header {{
            padding: 30px;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            text-align: center;
        }}
        .product-title {{
            margin: 0;
            font-size: 2em;
            font-weight: 300;
        }}
        .product-category {{
            opacity: 0.9;
            font-style: italic;
        }}
        .product-content {{
            padding: 30px;
        }}
        .product-price {{
            font-size: 2.5em;
            font-weight: bold;
            color: #27ae60;
            text-align: center;
            margin: 20px 0;
        }}
        .product-description {{
            color: #495057;
            line-height: 1.6;
            margin: 20px 0;
            font-size: 1.1em;
        }}
        .product-meta {{
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }}
        .product-rating {{
            text-align: center;
            font-size: 1.2em;
            margin: 15px 0;
        }}
        .product-status {{
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 500;
            font-size: 1em;
        }}
        .in-stock {{
            background: #d4edda;
            color: #155724;
        }}
        .out-of-stock {{
            background: #f8d7da;
            color: #721c24;
        }}
        .info-section {{
            background: #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }}
        .info-section h3 {{
            margin-top: 0;
            color: #495057;
        }}
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← Back to Products</a>

        <div class="product-header">
            <h1 class="product-title">{product['name']}</h1>
            <p class="product-category">{product['category']}</p>
        </div>

        <div class="product-content">
            <div class="product-price">${product['price']:.2f}</div>

            <div class="product-rating">
                {stars} ({product['rating']}/5)
            </div>

            <p class="product-description">{product['description']}</p>

            <div style="text-align: center; margin: 20px 0;">
                <span class="product-status {status_class}">{status_text}</span>
            </div>

            <div class="product-meta">
                <strong>ID:</strong> {product['id']}<br>
                <strong>Category:</strong> {product['category']}<br>
                <strong>Price:</strong> ${product['price']:.2f}<br>
                <strong>Rating:</strong> {product['rating']}/5<br>
                <strong>Status:</strong> {status_text}
            </div>

            <div class="info-section">
                <h3>🚀 Template Generation Demo</h3>
                <p>This product page was generated using Python Flask with embedded HTML templates!</p>
                <p><strong>Generated on:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                <p><strong>Template Engine:</strong> Python string formatting</p>
                <p><strong>Framework:</strong> Flask {__import__('flask').__version__}</p>
            </div>
        </div>
    </div>
</body>
</html>
"""
    return html

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'uptime': 'running'
    })

if __name__ == '__main__':
    print("🚀 Starting Flask Template Generation Demo...")
    print("📡 Visit http://localhost:5000")
    print("🔗 API: http://localhost:5000/api/products")
    print("💚 Health: http://localhost:5000/health")
    print("Press Ctrl+C to stop")
    app.run(debug=True, host='0.0.0.0', port=5000)
