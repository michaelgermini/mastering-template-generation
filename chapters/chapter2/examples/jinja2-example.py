"""
Jinja2 Template Engine Example
Demonstrates Jinja2 features including template inheritance, filters, and macros
"""

from jinja2 import Environment, FileSystemLoader, Template
from datetime import datetime
import json

# Create Jinja2 environment
env = Environment(loader=FileSystemLoader('.'))
env.globals['now'] = datetime.now

# Register custom filters
def format_currency(value):
    """Format number as currency"""
    return f"${value:,.2f}"

def format_date(value, format='%B %d, %Y'):
    """Format date"""
    if isinstance(value, str):
        value = datetime.fromisoformat(value.replace('Z', '+00:00'))
    return value.strftime(format)

def truncate_text(text, length=100):
    """Truncate text to specified length"""
    if len(text) <= length:
        return text
    return text[:length] + '...'

# Register filters
env.filters['currency'] = format_currency
env.filters['date'] = format_date
env.filters['truncate'] = truncate_text

# Base template with inheritance
base_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}{% endblock %}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #3498db;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .footer {
            background: #34495e;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
        }
        .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            background: white;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        .badge {
            background: #e74c3c;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            display: inline-block;
        }
        .price {
            font-size: 18px;
            font-weight: bold;
            color: #27ae60;
        }
        .sale-price {
            color: #e74c3c;
        }
        .original-price {
            text-decoration: line-through;
            color: #999;
            font-size: 14px;
        }
    </style>
    {% block extra_css %}{% endblock %}
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>{% block header %}{% endblock %}</h1>
            <p>Generated on {{ now().strftime('%B %d, %Y at %I:%M %p') }}</p>
        </header>
        
        <main>
            {% block content %}{% endblock %}
        </main>
        
        <footer class="footer">
            {% block footer %}
            <p>&copy; 2025 Template Generation Book. All rights reserved.</p>
            {% endblock %}
        </footer>
    </div>
</body>
</html>
"""

# User list template
user_list_template = """
{% extends "base.html" %}

{% block title %}User Directory{% endblock %}

{% block header %}User Directory{% endblock %}

{% block content %}
<div class="stats card">
    <h2>Statistics</h2>
    <p><strong>Total Users:</strong> {{ users|length }}</p>
    <p><strong>Admins:</strong> {{ users|selectattr('is_admin')|list|length }}</p>
    <p><strong>Active Users:</strong> {{ users|selectattr('is_active')|list|length }}</p>
    <p><strong>Last Updated:</strong> {{ last_updated|date }}</p>
</div>

{% if users %}
    <div class="grid">
        {% for user in users %}
            <div class="card">
                <h3>{{ user.name }}</h3>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Role:</strong> {{ user.role }}</p>
                <p><strong>Department:</strong> {{ user.department }}</p>
                <p><strong>Joined:</strong> {{ user.joined_date|date }}</p>
                
                {% if user.is_admin %}
                    <span class="badge">👑 Admin</span>
                {% endif %}
                
                {% if not user.is_active %}
                    <span class="badge" style="background: #95a5a6;">Inactive</span>
                {% endif %}
                
                {% if user.skills %}
                    <p><strong>Skills:</strong></p>
                    <ul>
                        {% for skill in user.skills %}
                            <li>{{ skill }}</li>
                        {% endfor %}
                    </ul>
                {% endif %}
            </div>
        {% endfor %}
    </div>
{% else %}
    <div class="card">
        <p>No users found.</p>
    </div>
{% endif %}
{% endblock %}
"""

# Product catalog template
product_catalog_template = """
{% extends "base.html" %}

{% block title %}Product Catalog{% endblock %}

{% block header %}Product Catalog{% endblock %}

{% block content %}
<div class="stats card">
    <h2>Catalog Statistics</h2>
    <p><strong>Total Products:</strong> {{ products|length }}</p>
    <p><strong>On Sale:</strong> {{ products|selectattr('on_sale')|list|length }}</p>
    <p><strong>Average Price:</strong> {{ (products|sum(attribute='price') / products|length)|currency }}</p>
    <p><strong>Categories:</strong> {{ products|map(attribute='category')|unique|list|join(', ') }}</p>
</div>

{% if products %}
    <div class="grid">
        {% for product in products %}
            <div class="card">
                <h3>{{ product.name }}</h3>
                <p class="description">{{ product.description|truncate(150) }}</p>
                
                <div class="pricing">
                    {% if product.on_sale %}
                        <p class="price sale-price">{{ product.sale_price|currency }}</p>
                        <p class="original-price">Was: {{ product.price|currency }}</p>
                        <span class="badge">SALE!</span>
                    {% else %}
                        <p class="price">{{ product.price|currency }}</p>
                    {% endif %}
                </div>
                
                <p><strong>Category:</strong> {{ product.category }}</p>
                <p><strong>Stock:</strong> {{ product.stock }} units</p>
                
                {% if product.rating %}
                    <p><strong>Rating:</strong> 
                        {% for i in range(product.rating) %}⭐{% endfor %}
                        ({{ product.rating }}/5)
                    </p>
                {% endif %}
                
                <button style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                    Add to Cart
                </button>
            </div>
        {% endfor %}
    </div>
{% else %}
    <div class="card">
        <p>No products available.</p>
    </div>
{% endif %}
{% endblock %}
"""

# Blog post template with macros
blog_template = """
{% extends "base.html" %}

{% block title %}{{ post.title }}{% endblock %}

{% block header %}{{ post.title }}{% endblock %}

{% macro render_author(author) %}
<div class="author-info">
    <h4>{{ author.name }}</h4>
    <p>{{ author.bio|truncate(100) }}</p>
    <p><a href="mailto:{{ author.email }}">{{ author.email }}</a></p>
</div>
{% endmacro %}

{% macro render_tag(tag) %}
<span class="tag" style="background: #ecf0f1; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block;">
    {{ tag }}
</span>
{% endmacro %}

{% block content %}
<article class="blog-post">
    <div class="post-meta card">
        <p><strong>Author:</strong> {{ render_author(post.author) }}</p>
        <p><strong>Published:</strong> {{ post.published_date|date }}</p>
        <p><strong>Reading Time:</strong> {{ post.content|length // 200 }} minutes</p>
        
        {% if post.tags %}
            <p><strong>Tags:</strong></p>
            <div class="tags">
                {% for tag in post.tags %}
                    {{ render_tag(tag) }}
                {% endfor %}
            </div>
        {% endif %}
    </div>
    
    <div class="post-content card">
        {{ post.content|safe }}
    </div>
    
    {% if post.comments %}
        <div class="comments card">
            <h3>Comments ({{ post.comments|length }})</h3>
            {% for comment in post.comments %}
                <div class="comment" style="border-left: 3px solid #3498db; padding-left: 15px; margin: 10px 0;">
                    <p><strong>{{ comment.author }}</strong> - {{ comment.date|date('%B %d, %Y') }}</p>
                    <p>{{ comment.content }}</p>
                </div>
            {% endfor %}
        </div>
    {% endif %}
</article>
{% endblock %}
"""

# Sample data
user_data = {
    'users': [
        {
            'name': 'Alice Johnson',
            'email': 'alice@company.com',
            'role': 'Senior Developer',
            'department': 'Engineering',
            'joined_date': '2023-01-15',
            'is_admin': True,
            'is_active': True,
            'skills': ['Python', 'JavaScript', 'React', 'Django']
        },
        {
            'name': 'Bob Smith',
            'email': 'bob@company.com',
            'role': 'Product Manager',
            'department': 'Product',
            'joined_date': '2022-08-20',
            'is_admin': False,
            'is_active': True,
            'skills': ['Product Strategy', 'User Research', 'Agile']
        },
        {
            'name': 'Carol Davis',
            'email': 'carol@company.com',
            'role': 'UX Designer',
            'department': 'Design',
            'joined_date': '2023-03-10',
            'is_admin': False,
            'is_active': False,
            'skills': ['UI/UX Design', 'Figma', 'Prototyping']
        }
    ],
    'last_updated': datetime.now()
}

product_data = {
    'products': [
        {
            'name': 'Premium Laptop',
            'description': 'High-performance laptop with the latest specifications and premium build quality. Perfect for professionals and power users who demand the best performance.',
            'price': 1299.99,
            'sale_price': 1099.99,
            'category': 'Electronics',
            'stock': 25,
            'rating': 4.5,
            'on_sale': True
        },
        {
            'name': 'Wireless Mouse',
            'description': 'Ergonomic wireless mouse with precision tracking and long battery life.',
            'price': 79.99,
            'category': 'Accessories',
            'stock': 150,
            'rating': 4.2,
            'on_sale': False
        },
        {
            'name': 'Mechanical Keyboard',
            'description': 'Premium mechanical keyboard with customizable RGB lighting and tactile switches.',
            'price': 199.99,
            'category': 'Accessories',
            'stock': 50,
            'rating': 4.8,
            'on_sale': False
        }
    ]
}

blog_data = {
    'post': {
        'title': 'The Future of Template Generation',
        'author': {
            'name': 'Dr. Sarah Wilson',
            'email': 'sarah@techblog.com',
            'bio': 'Senior Software Engineer with 10+ years of experience in web development and template systems.'
        },
        'published_date': '2025-01-15',
        'content': '''
        <p>Template generation has evolved significantly over the past decade. From simple string replacement to sophisticated AI-powered systems, the landscape continues to change rapidly.</p>
        
        <h2>The Rise of AI-Powered Templates</h2>
        <p>Artificial Intelligence is revolutionizing how we create and use templates. Modern AI systems can generate templates based on natural language descriptions, making template creation accessible to non-technical users.</p>
        
        <h2>Performance Considerations</h2>
        <p>As applications become more complex, template performance becomes crucial. Modern template engines offer features like precompilation, caching, and lazy loading to ensure optimal performance.</p>
        
        <h2>Security Best Practices</h2>
        <p>Template security is more important than ever. Always escape user input, validate data, and use sandboxed execution environments to prevent template injection attacks.</p>
        ''',
        'tags': ['Templates', 'AI', 'Web Development', 'Performance'],
        'comments': [
            {
                'author': 'John Doe',
                'date': '2025-01-16',
                'content': 'Great article! I especially liked the section on AI-powered templates.'
            },
            {
                'author': 'Jane Smith',
                'date': '2025-01-17',
                'content': 'The security section was very informative. Thanks for sharing!'
            }
        ]
    }
}

def render_user_list():
    """Render user list template"""
    template = env.from_string(user_list_template)
    return template.render(**user_data)

def render_product_catalog():
    """Render product catalog template"""
    template = env.from_string(product_catalog_template)
    return template.render(**product_data)

def render_blog_post():
    """Render blog post template"""
    template = env.from_string(blog_template)
    return template.render(**blog_data)

if __name__ == "__main__":
    print("=== Jinja2 User List Example ===")
    print(render_user_list())
    
    print("\n=== Jinja2 Product Catalog Example ===")
    print(render_product_catalog())
    
    print("\n=== Jinja2 Blog Post Example ===")
    print(render_blog_post())
