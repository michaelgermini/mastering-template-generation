#!/usr/bin/env python3
"""
Comprehensive Template Generation Demo
Showcases multiple template types and generation scenarios
"""

from jinja2 import Template
from datetime import datetime
import json
import os

def main():
    print("🎯 Comprehensive Template Generation Demo")
    print("=" * 60)
    print("🚀 Flask app is running at: http://localhost:5000")
    print("=" * 60)

    # 1. Email Template Generation
    print("\n1. 📧 Email Template Generation")
    print("-" * 40)

    email_template = '''
Subject: {{ subject }}

Dear {{ recipient.name }},

{{ greeting }}

{{ content }}

{% if offer %}
🎯 Special Offer: {{ offer.description }}
   Discount: {{ offer.discount }}%
   Valid until: {{ offer.expiry_date.strftime('%B %d, %Y') }}
{% endif %}

{% if signature %}
{{ signature }}
{% endif %}

Best regards,
{{ sender.name }}
{{ sender.title }}
{{ sender.company }}
{{ sender.contact }}

---
This email was generated automatically using template generation technology.
{% if unsubscribe_link %}
Unsubscribe: {{ unsubscribe_link }}
{% endif %}
'''

    email_data = {
        'subject': 'Welcome to TechCorp Solutions!',
        'recipient': {
            'name': 'Alice Johnson',
            'email': 'alice@example.com'
        },
        'greeting': 'Welcome to our platform! We\'re excited to have you on board.',
        'content': '''
Thank you for joining TechCorp Solutions. Your account has been successfully created and you now have access to all our premium features.

Your account details:
• Username: alice_j
• Registration Date: {{ recipient.registration_date.strftime('%B %d, %Y') }}
• Account Type: Premium

Get started by exploring our dashboard and connecting with other professionals in your field.
''',
        'offer': {
            'description': 'First Month Free Premium Access',
            'discount': 100,
            'expiry_date': datetime.now().replace(day=15)
        },
        'signature': 'We look forward to your success with our platform!',
        'sender': {
            'name': 'Sarah Wilson',
            'title': 'Customer Success Manager',
            'company': 'TechCorp Solutions',
            'contact': 'sarah.wilson@techcorp.com | (555) 123-4567'
        },
        'unsubscribe_link': 'https://techcorp.com/unsubscribe?email={{ recipient.email }}'
    }

    template = Template(email_template)
    email_output = template.render(**email_data)

    with open('welcome_email.txt', 'w', encoding='utf-8') as f:
        f.write(email_output)

    print("✅ Generated welcome email saved as 'welcome_email.txt'")
    print("📧 Email for:", email_data['recipient']['name'])

    # 2. Configuration File Generation
    print("\n2. ⚙️ Configuration File Generation")
    print("-" * 45)

    config_template = '''
# {{ app_name }} Configuration File
# Generated on {{ timestamp.strftime('%Y-%m-%d %H:%M:%S') }}
# Version: {{ version }}

[application]
name = {{ app_name }}
version = {{ version }}
environment = {{ environment }}
debug = {{ debug | lower }}

[database]
host = {{ database.host }}
port = {{ database.port }}
name = {{ database.name }}
username = {{ database.username }}
password = {{ database.password }}
connection_pool_size = {{ database.pool_size }}

[api]
base_url = {{ api.base_url }}
timeout = {{ api.timeout }}
retry_attempts = {{ api.retry_attempts }}
rate_limit = {{ api.rate_limit }}

[features]
{% for feature, enabled in features.items() %}
{{ feature }} = {{ enabled | lower }}
{% endfor %}

[logging]
level = {{ logging.level }}
file = {{ logging.file }}
max_size_mb = {{ logging.max_size_mb }}
backup_count = {{ logging.backup_count }}

[security]
secret_key = {{ security.secret_key }}
jwt_expiry_hours = {{ security.jwt_expiry_hours }}
password_min_length = {{ security.password_min_length }}
enable_2fa = {{ security.enable_2fa | lower }}

[email]
smtp_server = {{ email.smtp_server }}
smtp_port = {{ email.smtp_port }}
username = {{ email.username }}
password = {{ email.password }}
use_tls = {{ email.use_tls | lower }}
from_address = {{ email.from_address }}

# Auto-generated configuration - do not edit manually
'''

    config_data = {
        'app_name': 'TechCorp Platform',
        'version': '2.1.0',
        'environment': 'production',
        'debug': False,
        'timestamp': datetime.now(),
        'database': {
            'host': 'db.techcorp.internal',
            'port': 5432,
            'name': 'techcorp_prod',
            'username': 'techcorp_app',
            'password': 'secure_password_123',
            'pool_size': 20
        },
        'api': {
            'base_url': 'https://api.techcorp.com/v2',
            'timeout': 30,
            'retry_attempts': 3,
            'rate_limit': 1000
        },
        'features': {
            'user_registration': True,
            'email_notifications': True,
            'analytics': True,
            'api_access': True,
            'file_upload': False,
            'social_login': True
        },
        'logging': {
            'level': 'INFO',
            'file': '/var/log/techcorp/app.log',
            'max_size_mb': 100,
            'backup_count': 5
        },
        'security': {
            'secret_key': 'super-secret-jwt-key-change-in-production',
            'jwt_expiry_hours': 24,
            'password_min_length': 8,
            'enable_2fa': True
        },
        'email': {
            'smtp_server': 'smtp.gmail.com',
            'smtp_port': 587,
            'username': 'noreply@techcorp.com',
            'password': 'app-specific-password',
            'use_tls': True,
            'from_address': 'noreply@techcorp.com'
        }
    }

    template = Template(config_template)
    config_output = template.render(**config_data)

    with open('app_config.ini', 'w', encoding='utf-8') as f:
        f.write(config_output)

    print("✅ Generated configuration file saved as 'app_config.ini'")
    print("⚙️ Application:", config_data['app_name'])

    # 3. SQL Schema Generation
    print("\n3. 🗄️ SQL Schema Generation")
    print("-" * 35)

    sql_template = '''
-- {{ project_name }} Database Schema
-- Generated on {{ timestamp.strftime('%Y-%m-%d %H:%M:%S') }}
-- Version: {{ version }}

{% for table in tables %}
-- Table: {{ table.name }}
CREATE TABLE IF NOT EXISTS {{ table.name }} (
{% for column in table.columns %}
    {{ column.name }} {{ column.type }}{% if column.length %}({{ column.length }}){% endif %}{% if column.nullable %} NULL{% else %} NOT NULL{% endif %}{% if column.default %} DEFAULT {{ column.default }}{% endif %}{% if column.primary_key %} PRIMARY KEY{% endif %}{% if not loop.last %},{% endif %}
{% endfor %}
{% if table.indexes %}

    -- Indexes for {{ table.name }}
{% for index in table.indexes %}
CREATE INDEX idx_{{ table.name }}_{{ index.name }} ON {{ table.name }} ({{ index.columns | join(', ') }});
{% endfor %}
{% endif %}
);

{% endfor %}

-- Insert sample data
{% for table in tables %}
{% if table.sample_data %}
-- Sample data for {{ table.name }}
INSERT INTO {{ table.name }} ({{ table.sample_data[0].keys() | join(', ') }}) VALUES
{% for row in table.sample_data %}
({% for key, value in row.items() %}'{{ value }}'{% if not loop.last %}, {% endif %}{% endfor %}){% if not loop.last %},{% endif %}
{% endfor %};

{% endif %}
{% endfor %}

-- Create relationships
{% for relationship in relationships %}
ALTER TABLE {{ relationship.table }} ADD CONSTRAINT fk_{{ relationship.name }}
    FOREIGN KEY ({{ relationship.column }}) REFERENCES {{ relationship.references_table }} ({{ relationship.references_column }});
{% endfor %}

COMMIT;
'''

    sql_data = {
        'project_name': 'E-commerce Platform',
        'version': '1.0.0',
        'timestamp': datetime.now(),
        'tables': [
            {
                'name': 'users',
                'columns': [
                    {'name': 'id', 'type': 'SERIAL', 'nullable': False, 'primary_key': True},
                    {'name': 'email', 'type': 'VARCHAR', 'length': 255, 'nullable': False},
                    {'name': 'password_hash', 'type': 'VARCHAR', 'length': 255, 'nullable': False},
                    {'name': 'first_name', 'type': 'VARCHAR', 'length': 100, 'nullable': False},
                    {'name': 'last_name', 'type': 'VARCHAR', 'length': 100, 'nullable': False},
                    {'name': 'created_at', 'type': 'TIMESTAMP', 'nullable': False, 'default': 'CURRENT_TIMESTAMP'},
                    {'name': 'is_active', 'type': 'BOOLEAN', 'nullable': False, 'default': 'TRUE'}
                ],
                'indexes': [
                    {'name': 'email', 'columns': ['email']}
                ],
                'sample_data': [
                    {'email': 'alice@example.com', 'password_hash': 'hashed_password_1', 'first_name': 'Alice', 'last_name': 'Johnson'},
                    {'email': 'bob@example.com', 'password_hash': 'hashed_password_2', 'first_name': 'Bob', 'last_name': 'Smith'}
                ]
            },
            {
                'name': 'products',
                'columns': [
                    {'name': 'id', 'type': 'SERIAL', 'nullable': False, 'primary_key': True},
                    {'name': 'name', 'type': 'VARCHAR', 'length': 255, 'nullable': False},
                    {'name': 'description', 'type': 'TEXT', 'nullable': True},
                    {'name': 'price', 'type': 'DECIMAL', 'length': '10,2', 'nullable': False},
                    {'name': 'category', 'type': 'VARCHAR', 'length': 100, 'nullable': False},
                    {'name': 'stock_quantity', 'type': 'INTEGER', 'nullable': False, 'default': '0'},
                    {'name': 'created_at', 'type': 'TIMESTAMP', 'nullable': False, 'default': 'CURRENT_TIMESTAMP'}
                ],
                'indexes': [
                    {'name': 'category', 'columns': ['category']},
                    {'name': 'price', 'columns': ['price']}
                ]
            }
        ],
        'relationships': [
            {
                'name': 'user_orders',
                'table': 'orders',
                'column': 'user_id',
                'references_table': 'users',
                'references_column': 'id'
            }
        ]
    }

    template = Template(sql_template)
    sql_output = template.render(**sql_data)

    with open('database_schema.sql', 'w', encoding='utf-8') as f:
        f.write(sql_output)

    print("✅ Generated SQL schema saved as 'database_schema.sql'")
    print("🗄️ Database:", sql_data['project_name'])

    # 4. Markdown Documentation Generation
    print("\n4. 📚 Markdown Documentation Generation")
    print("-" * 50)

    markdown_template = '''
# {{ project.name }}

{{ project.description }}

## Overview

- **Version**: {{ project.version }}
- **Status**: {{ project.status }}
- **Last Updated**: {{ timestamp.strftime('%B %d, %Y') }}

## Features

{% for feature in project.features %}
### {{ feature.name }}

{{ feature.description }}

{% if feature.code_example %}
```{{ feature.language }}
{{ feature.code_example }}
```
{% endif %}

{% if feature.benefits %}
**Benefits:**
{% for benefit in feature.benefits %}
- {{ benefit }}
{% endfor %}
{% endif %}

{% endfor %}

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
{% for endpoint in api.endpoints %}
| {{ endpoint.method }} | `{{ endpoint.path }}` | {{ endpoint.description }} |
{% endfor %}

## Installation

```bash
{{ installation.command }}
```

## Configuration

{% for config in configuration %}
### {{ config.name }}

{{ config.description }}

```json
{{ config.example | tojson(indent=2) }}
```
{% endfor %}

## Usage Examples

{% for example in usage_examples %}
### {{ example.title }}

{{ example.description }}

```{{ example.language }}
{{ example.code }}
```
{% endfor %}

## Contributing

{{ contributing.guidelines }}

## License

{{ license.name }} - {{ license.description }}

---
*Documentation auto-generated from templates*
'''

    markdown_data = {
        'project': {
            'name': 'Template Generation Engine',
            'description': 'A powerful template generation system for creating dynamic content, code, and documentation.',
            'version': '2.1.0',
            'status': 'Production Ready',
            'features': [
                {
                    'name': 'Variable Substitution',
                    'description': 'Replace variables in templates with dynamic data.',
                    'language': 'jinja2',
                    'code_example': 'Hello {{ name }}! Welcome to {{ company }}.',
                    'benefits': ['Dynamic content generation', 'Reusable templates', 'Clean separation of data and presentation']
                },
                {
                    'name': 'Code Generation',
                    'description': 'Generate complete code files from templates.',
                    'language': 'python',
                    'code_example': '''
from jinja2 import Template

template = Template("class {{ class_name }}: pass")
result = template.render(class_name="User")
print(result)  # Output: class User: pass
''',
                    'benefits': ['Rapid prototyping', 'Consistent code structure', 'Reduced boilerplate']
                }
            ]
        },
        'timestamp': datetime.now(),
        'api': {
            'endpoints': [
                {'method': 'GET', 'path': '/api/templates', 'description': 'List all templates'},
                {'method': 'POST', 'path': '/api/templates', 'description': 'Create new template'},
                {'method': 'GET', 'path': '/api/templates/{id}', 'description': 'Get template by ID'},
                {'method': 'PUT', 'path': '/api/templates/{id}', 'description': 'Update template'},
                {'method': 'DELETE', 'path': '/api/templates/{id}', 'description': 'Delete template'}
            ]
        },
        'installation': {
            'command': '''
pip install jinja2 flask
git clone https://github.com/techcorp/template-engine.git
cd template-engine
python setup.py install
'''
        },
        'configuration': [
            {
                'name': 'Basic Configuration',
                'description': 'Minimal configuration to get started',
                'example': {
                    'template_dir': './templates',
                    'output_dir': './output',
                    'cache_enabled': True
                }
            }
        ],
        'usage_examples': [
            {
                'title': 'Simple Template Rendering',
                'description': 'Basic example of template rendering',
                'language': 'python',
                'code': '''
from template_engine import TemplateEngine

engine = TemplateEngine()
template = engine.load_template('welcome.txt')
result = engine.render(template, {'name': 'Alice', 'company': 'TechCorp'})
print(result)
'''
            }
        ],
        'contributing': {
            'guidelines': '''
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request
'''
        },
        'license': {
            'name': 'MIT License',
            'description': 'Permissive license allowing commercial and private use'
        }
    }

    template = Template(markdown_template)
    markdown_output = template.render(**markdown_data)

    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(markdown_output)

    print("✅ Generated documentation saved as 'README.md'")
    print("📚 Documentation for:", markdown_data['project']['name'])

    # Summary
    print("\n" + "=" * 60)
    print("✅ Comprehensive Template Generation Demo Complete!")
    print("=" * 60)

    print("\n📁 Generated Files:")
    print("• welcome_email.txt - Professional email template")
    print("• app_config.ini - Complete application configuration")
    print("• database_schema.sql - Full database schema with sample data")
    print("• README.md - Comprehensive project documentation")
    print("• invoice.html (previous) - Professional invoice")
    print("• api_response.json (previous) - API response")
    print("• UserProfileCard.jsx (previous) - React component")
    print("• app.py (running) - Flask web application")

    print("\n🌐 Web Application:")
    print("🚀 Flask app running at: http://localhost:5000")
    print("📊 Visit the URLs above to see template generation in action!")

    print("\n🎯 Template Types Demonstrated:")
    print("• ✉️ Email templates with conditional content")
    print("• ⚙️ Configuration files with nested structures")
    print("• 🗄️ SQL schemas with relationships and sample data")
    print("• 📚 Markdown documentation with complex formatting")
    print("• 📄 HTML documents with professional styling")
    print("• 🔌 JSON APIs with structured responses")
    print("• ⚛️ React components with full functionality")
    print("• 🌐 Flask applications with routing and templates")

    print("\n🚀 Ready for production template generation!")
    print("💡 Try customizing the templates or creating your own!")

if __name__ == "__main__":
    main()
