
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json

app = Flask(__name__)

# Sample data
PRODUCTS = [
  {
    "category": "Electronics",
    "description": "Premium wireless headphones with noise cancellation",
    "id": 1,
    "in_stock": True,
    "name": "Wireless Headphones",
    "price": 199.99,
    "rating": 4.5
  },
  {
    "category": "Furniture",
    "description": "Comfortable ergonomic office chair",
    "id": 2,
    "in_stock": True,
    "name": "Ergonomic Chair",
    "price": 399.99,
    "rating": 4.8
  },
  {
    "category": "Appliances",
    "description": "Programmable coffee maker with thermal carafe",
    "id": 3,
    "in_stock": False,
    "name": "Coffee Maker",
    "price": 89.99,
    "rating": 4.2
  }
]

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html', products=PRODUCTS)

@app.route('/api/products')
def get_products():
    """API endpoint for products"""
    category = request.args.get('category')
    if category:
        filtered_products = [p for p in PRODUCTS if p['category'].lower() == category.lower()]
    else:
        filtered_products = PRODUCTS

    return jsonify({
        'status': 'success',
        'count': len(filtered_products),
        'data': filtered_products
    })

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    """Product detail page"""
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if not product:
        return render_template('404.html'), 404

    return render_template('product.html', product=product)

@app.template_filter('currency')
def currency_filter(value):
    """Format number as currency"""
    return f"${value:,.2f}"

@app.template_filter('date_format')
def date_format_filter(date_str):
    """Format date string"""
    try:
        date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return date_obj.strftime('%B %d, %Y')
    except:
        return date_str

if __name__ == '__main__':
    print("🚀 Starting Flask application...")
    print("📡 Visit http://localhost:5000")
    app.run(debug=True, port=5000)