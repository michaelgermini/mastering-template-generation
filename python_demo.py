#!/usr/bin/env python3
"""
Python Template Generation Demo
Demonstrates document and code generation using available packages
"""

from jinja2 import Template
from flask import Flask
from datetime import datetime
import json
import os

def main():
    print("🎯 Mastering Template Generation - Python Demo")
    print("=" * 60)

    # 1. HTML Document Generation
    print("\n1. HTML Document Generation")
    print("-" * 35)

    html_template = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ document.title }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .content { margin: 20px 0; }
        .invoice-table { width: 100%; border-collapse: collapse; }
        .invoice-table th, .invoice-table td {
            border: 1px solid #ddd; padding: 8px; text-align: left;
        }
        .total { font-weight: bold; background: #e9ecef; }
        .signature { margin-top: 40px; border-top: 1px solid #000; width: 200px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ document.title }}</h1>
        <p><strong>Invoice #:</strong> {{ document.invoice_number }}</p>
        <p><strong>Date:</strong> {{ document.date.strftime('%B %d, %Y') }}</p>
        <p><strong>Due Date:</strong> {{ document.due_date.strftime('%B %d, %Y') }}</p>
    </div>

    <div class="content">
        <h2>Bill To:</h2>
        <p>{{ document.customer.name }}<br>
        {{ document.customer.address }}<br>
        {{ document.customer.city }}, {{ document.customer.state }} {{ document.customer.zip }}</p>

        <h2>Items:</h2>
        <table class="invoice-table">
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
            {% for item in document.line_items %}
            <tr>
                <td>{{ item.description }}</td>
                <td>{{ item.quantity }}</td>
                <td>${{ "%.2f"|format(item.unit_price) }}</td>
                <td>${{ "%.2f"|format(item.quantity * item.unit_price) }}</td>
            </tr>
            {% endfor %}
            <tr class="total">
                <td colspan="3"><strong>Total Amount:</strong></td>
                <td><strong>${{ "%.2f"|format(document.total) }}</strong></td>
            </tr>
        </table>
    </div>

    <div class="signature">
        <p>Authorized Signature</p>
    </div>
</body>
</html>
'''

    invoice_data = {
        'document': {
            'title': 'Invoice',
            'invoice_number': 'INV-2025-001',
            'date': datetime.now(),
            'due_date': datetime.now().replace(month=((datetime.now().month % 12) + 1), day=15) if datetime.now().month < 12 else datetime.now().replace(year=datetime.now().year + 1, month=1, day=15),
            'customer': {
                'name': 'TechCorp Solutions Inc.',
                'address': '123 Business Ave',
                'city': 'San Francisco',
                'state': 'CA',
                'zip': '94105'
            },
            'line_items': [
                {'description': 'Web Development Services', 'quantity': 40, 'unit_price': 125.00},
                {'description': 'Database Design', 'quantity': 20, 'unit_price': 150.00},
                {'description': 'API Integration', 'quantity': 15, 'unit_price': 200.00}
            ],
            'total': 40 * 125.00 + 20 * 150.00 + 15 * 200.00
        }
    }

    template = Template(html_template)
    html_output = template.render(**invoice_data)

    # Save HTML file
    with open('invoice.html', 'w', encoding='utf-8') as f:
        f.write(html_output)

    print("✅ Generated HTML invoice saved as 'invoice.html'")
    print(f"📊 Invoice total: ${invoice_data['document']['total']:.2f}")

    # 2. JSON API Response Template
    print("\n2. JSON API Response Generation")
    print("-" * 35)

    api_template = '''
{
  "status": "success",
  "timestamp": "{{ timestamp.isoformat() }}",
  "request_id": "{{ request_id }}",
  "data": {
    "user": {
      "id": {{ user.id }},
      "name": "{{ user.name }}",
      "email": "{{ user.email }}",
      "role": "{{ user.role }}",
      "active": {{ user.active | lower }},
      "last_login": "{{ user.last_login.isoformat() if user.last_login else None }}",
      "permissions": {{ user.permissions | tojson(indent=2) }}
    },
    "organization": {
      "id": {{ organization.id }},
      "name": "{{ organization.name }}",
      "plan": "{{ organization.plan }}",
      "member_count": {{ organization.members | length }}
    }
  },
  "meta": {
    "version": "{{ api_version }}",
    "processing_time_ms": {{ processing_time }}
  }
}
'''

    api_data = {
        'timestamp': datetime.now(),
        'request_id': 'req_abc123def456',
        'user': {
            'id': 12345,
            'name': 'Alice Johnson',
            'email': 'alice@techcorp.com',
            'role': 'Senior Developer',
            'active': True,
            'last_login': datetime.now(),
            'permissions': ['read', 'write', 'admin', 'billing']
        },
        'organization': {
            'id': 67890,
            'name': 'TechCorp Solutions',
            'plan': 'Enterprise',
            'members': ['alice', 'bob', 'carol', 'david', 'eve']
        },
        'api_version': '2.1.0',
        'processing_time': 45
    }

    template = Template(api_template)
    json_output = template.render(**api_data)

    # Parse and pretty print the JSON
    parsed_json = json.loads(json_output)
    formatted_json = json.dumps(parsed_json, indent=2)

    # Save JSON file
    with open('api_response.json', 'w', encoding='utf-8') as f:
        f.write(formatted_json)

    print("✅ Generated API response saved as 'api_response.json'")
    print(f"📊 User: {parsed_json['data']['user']['name']} ({parsed_json['data']['user']['role']})")

    # 3. Code Generation with Cookiecutter-style Templates
    print("\n3. Code Generation - React Component")
    print("-" * 40)

    react_template = '''
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './{{ component.name | lower }}.css';

const {{ component.name }} = ({ {{ component.props | join(', ') }} }) => {
  const [{{ component.state | join(', ') }}] = useState({{ component.default_state | tojson }});

  useEffect(() => {
    // Component initialization
    {{ component.initialize | default('// TODO: Add initialization logic') }}
  }, []);

  {% if component.methods %}
  {% for method in component.methods %}
  const {{ method.name }} = {{ method.body }};
  {% endfor %}
  {% endif %}

  return (
    <div className="{{ component.name | lower }}-container">
      {% if component.header %}
      <header className="component-header">
        <h2>{{ component.header }}</h2>
      </header>
      {% endif %}

      <div className="component-content">
        {{ component.content }}
      </div>

      {% if component.footer %}
      <footer className="component-footer">
        {{ component.footer }}
      </footer>
      {% endif %}
    </div>
  );
};

{{ component.name }}.propTypes = {
  {% for prop in component.prop_types %}
  {{ prop.name }}: PropTypes.{{ prop.type }}{{ ',' if not loop.last else '' }}
  {% endfor %}
};

export default {{ component.name }};
'''

    component_data = {
        'component': {
            'name': 'UserProfileCard',
            'props': ['user', 'onEdit', 'onDelete'],
            'state': ['isEditing', 'isLoading'],
            'default_state': {'isEditing': False, 'isLoading': False},
            'initialize': 'console.log("UserProfileCard initialized");',
            'header': 'User Profile',
            'content': '''
            <div className="user-info">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>{user.role}</p>
            </div>
            <div className="user-actions">
              <button onClick={onEdit} disabled={isLoading}>
                {isEditing ? 'Save' : 'Edit'}
              </button>
              <button onClick={onDelete} disabled={isLoading}>
                Delete
              </button>
            </div>
            ''',
            'footer': '<p>Last updated: {user.lastUpdated}</p>',
            'methods': [
                {
                    'name': 'handleEdit',
                    'body': '() => {\n    setIsEditing(!isEditing);\n    if (onEdit) onEdit(user.id);\n  }'
                },
                {
                    'name': 'handleDelete',
                    'body': '() => {\n    if (window.confirm(\'Are you sure?\')) {\n      onDelete(user.id);\n    }\n  }'
                }
            ],
            'prop_types': [
                {'name': 'user', 'type': 'object.isRequired'},
                {'name': 'onEdit', 'type': 'func'},
                {'name': 'onDelete', 'type': 'func'}
            ]
        }
    }

    template = Template(react_template)
    react_output = template.render(**component_data)

    # Save React component
    with open('UserProfileCard.jsx', 'w', encoding='utf-8') as f:
        f.write(react_output)

    print("✅ Generated React component saved as 'UserProfileCard.jsx'")
    print(f"📊 Component: {component_data['component']['name']}")

    # 4. Flask Web Application Template
    print("\n4. Flask Web Application Generation")
    print("-" * 40)

    flask_template = '''
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json

app = Flask(__name__)

# Sample data
PRODUCTS = {{ products | tojson(indent=2) }}

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
'''

    flask_data = {
        'products': [
            {
                'id': 1,
                'name': 'Wireless Headphones',
                'price': 199.99,
                'category': 'Electronics',
                'description': 'Premium wireless headphones with noise cancellation',
                'in_stock': True,
                'rating': 4.5
            },
            {
                'id': 2,
                'name': 'Ergonomic Chair',
                'price': 399.99,
                'category': 'Furniture',
                'description': 'Comfortable ergonomic office chair',
                'in_stock': True,
                'rating': 4.8
            },
            {
                'id': 3,
                'name': 'Coffee Maker',
                'price': 89.99,
                'category': 'Appliances',
                'description': 'Programmable coffee maker with thermal carafe',
                'in_stock': False,
                'rating': 4.2
            }
        ]
    }

    template = Template(flask_template)
    flask_output = template.render(**flask_data)

    # Save Flask application
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(flask_output)

    print("✅ Generated Flask application saved as 'app.py'")
    print("🚀 To run: python app.py")

    # Summary
    print("\n" + "=" * 60)
    print("✅ Template Generation Demo Complete!")
    print("\n📁 Generated Files:")
    print("• invoice.html - Professional HTML invoice")
    print("• api_response.json - Structured API response")
    print("• UserProfileCard.jsx - React component")
    print("• app.py - Flask web application")

    print("\n🎯 Key Features Demonstrated:")
    print("• HTML document generation with styling")
    print("• JSON API response templating")
    print("• React component code generation")
    print("• Flask web application scaffolding")
    print("• Template filters and custom functions")

    print("\n🚀 Ready for advanced template automation!")

if __name__ == "__main__":
    main()
