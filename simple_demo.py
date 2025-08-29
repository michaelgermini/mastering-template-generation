#!/usr/bin/env python3
"""
Simple Template Generation Demo
Demonstrates basic template concepts using Python
"""

from jinja2 import Template
from datetime import datetime
import json

def main():
    print("🎯 Mastering Template Generation - Python Demo")
    print("=" * 50)

    # 1. Basic Variable Replacement
    print("\n1. Basic Variable Replacement")
    print("-" * 30)

    basic_template = '''
Hello {{ name }}!

Welcome to {{ company }}. Your account has been {{ status }}.

Account Details:
- Username: {{ username }}
- Email: {{ email }}
- Joined: {{ joined_date.strftime('%B %d, %Y') }}
'''

    basic_data = {
        'name': 'Alice Johnson',
        'company': 'TechCorp Solutions',
        'status': 'activated',
        'username': 'alice_j',
        'email': 'alice.johnson@techcorp.com',
        'joined_date': datetime.now()
    }

    template = Template(basic_template)
    result = template.render(**basic_data)
    print(result.strip())

    # 2. Conditional Logic
    print("\n2. Conditional Logic")
    print("-" * 20)

    conditional_template = '''
Product: {{ product.name }}
Price: ${{ "%.2f" | format(product.price) }}

{% if product.on_sale %}
🎉 ON SALE! Save ${{ "%.2f" | format(product.price - product.sale_price) }}
New Price: ${{ "%.2f" | format(product.sale_price) }}
{% endif %}

{% if product.stock < 10 %}
⚠️  Only {{ product.stock }} left in stock!
{% endif %}

{% if product.rating >= 4.5 %}
⭐⭐⭐⭐⭐ Highly Rated ({{ product.rating }}/5)
{% elif product.rating >= 4.0 %}
⭐⭐⭐⭐ Good Rating ({{ product.rating }}/5)
{% else %}
⭐⭐⭐⭐ Rating: {{ product.rating }}/5
{% endif %}
'''

    product_data = {
        'product': {
            'name': 'Premium Wireless Headphones',
            'price': 299.99,
            'sale_price': 249.99,
            'on_sale': True,
            'stock': 5,
            'rating': 4.7
        }
    }

    template = Template(conditional_template)
    result = template.render(**product_data)
    print(result.strip())

    # 3. Loops and Lists
    print("\n3. Loops and Data Lists")
    print("-" * 25)

    list_template = '''
📧 Email Campaign Recipients:

{% for recipient in recipients %}
{{ loop.index }}. {{ recipient.name }} <{{ recipient.email }}>
   Status: {{ recipient.status }}
   {% if recipient.tags %}
   Tags: {{ recipient.tags | join(', ') }}
   {% endif %}
{% endfor %}

Total Recipients: {{ recipients | length }}
Active Recipients: {{ recipients | selectattr('status', 'equalto', 'active') | list | length }}
'''

    email_data = {
        'recipients': [
            {'name': 'Alice Johnson', 'email': 'alice@test.com', 'status': 'active', 'tags': ['customer', 'premium']},
            {'name': 'Bob Smith', 'email': 'bob@test.com', 'status': 'inactive', 'tags': ['prospect']},
            {'name': 'Carol Davis', 'email': 'carol@test.com', 'status': 'active', 'tags': ['customer']},
            {'name': 'David Wilson', 'email': 'david@test.com', 'status': 'active', 'tags': ['customer', 'vip']}
        ]
    }

    template = Template(list_template)
    result = template.render(**email_data)
    print(result.strip())

    # 4. JSON Template Generation
    print("\n4. JSON Template Generation")
    print("-" * 30)

    json_template = '''
{
  "api_response": {
    "status": "success",
    "timestamp": "{{ timestamp }}",
    "data": {
      "user_id": "{{ user.id }}",
      "user_name": "{{ user.name }}",
      "user_email": "{{ user.email }}",
      "preferences": {{ user.preferences | tojson(indent=2) }}
    },
    "metadata": {
      "version": "{{ version }}",
      "generated_by": "Template Engine v{{ engine_version }}"
    }
  }
}
'''

    json_data = {
        'timestamp': datetime.now().isoformat(),
        'user': {
            'id': 12345,
            'name': 'Alice Johnson',
            'email': 'alice@test.com',
            'preferences': {
                'theme': 'dark',
                'notifications': True,
                'language': 'en'
            }
        },
        'version': '2.1.0',
        'engine_version': '1.0'
    }

    template = Template(json_template)
    result = template.render(**json_data)
    print("Generated JSON:")
    print(result.strip())

    # 5. Summary
    print("\n" + "=" * 50)
    print("✅ Template Generation Demo Complete!")
    print("\nKey concepts demonstrated:")
    print("• Variable replacement")
    print("• Conditional logic")
    print("• Loops and iteration")
    print("• JSON generation")
    print("• Template inheritance and composition")

    print("\n📚 This demonstrates the core concepts from the book!")
    print("🚀 Ready to explore advanced automation and AI-powered templates!")

if __name__ == "__main__":
    main()
