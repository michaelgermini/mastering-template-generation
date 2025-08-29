const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const mjml = require('mjml');
const fs = require('fs');
const path = require('path');

class EmailTemplateSystem {
    constructor(config = {}) {
        this.config = {
            smtp: {
                host: config.smtp?.host || 'smtp.gmail.com',
                port: config.smtp?.port || 587,
                secure: config.smtp?.secure || false,
                auth: {
                    user: config.smtp?.auth?.user || process.env.EMAIL_USER,
                    pass: config.smtp?.auth?.pass || process.env.EMAIL_PASS
                }
            },
            defaultFrom: config.defaultFrom || 'noreply@company.com',
            templatesDir: config.templatesDir || './templates'
        };

        this.transporter = nodemailer.createTransporter(this.config.smtp);
        this.templates = new Map();
        this.loadTemplates();
        this.registerHelpers();
    }

    loadTemplates() {
        const templatesDir = this.config.templatesDir;
        
        if (!fs.existsSync(templatesDir)) {
            console.warn(`Templates directory not found: ${templatesDir}`);
            return;
        }

        const templateFiles = fs.readdirSync(templatesDir)
            .filter(file => file.endsWith('.hbs'));

        templateFiles.forEach(file => {
            const templateName = path.basename(file, '.hbs');
            const templatePath = path.join(templatesDir, file);
            const templateContent = fs.readFileSync(templatePath, 'utf8');
            
            this.templates.set(templateName, handlebars.compile(templateContent));
            console.log(`Loaded template: ${templateName}`);
        });
    }

    registerHelpers() {
        // Date formatting helper
        handlebars.registerHelper('formatDate', function(date, format = 'MM/DD/YYYY') {
            const d = new Date(date);
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            return d.toLocaleDateString('en-US', options);
        });

        // Currency formatting helper
        handlebars.registerHelper('formatCurrency', function(amount, currency = 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(amount);
        });

        // Conditional helper for A/B testing
        handlebars.registerHelper('abTest', function(variant, options) {
            const variants = {
                'A': options.hash.variantA,
                'B': options.hash.variantB
            };
            return variants[variant] || variants['A'];
        });

        // Pluralization helper
        handlebars.registerHelper('pluralize', function(count, singular, plural) {
            return count === 1 ? singular : plural;
        });

        // Truncate text helper
        handlebars.registerHelper('truncate', function(text, length = 100) {
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        });

        // Math operations helper
        handlebars.registerHelper('math', function(a, operator, b) {
            switch (operator) {
                case '+': return a + b;
                case '-': return a - b;
                case '*': return a * b;
                case '/': return a / b;
                default: return a;
            }
        });
    }

    async sendEmail(templateName, data, options = {}) {
        try {
            // Get template
            const template = this.templates.get(templateName);
            if (!template) {
                throw new Error(`Template not found: ${templateName}`);
            }

            // Prepare email data
            const emailData = {
                ...data,
                year: new Date().getFullYear(),
                company: {
                    name: 'TechCorp Solutions',
                    website: 'https://techcorp.com',
                    support_email: 'support@techcorp.com'
                }
            };

            // Render template
            const html = template(emailData);

            // Email options
            const mailOptions = {
                from: options.from || this.config.defaultFrom,
                to: data.recipient_email,
                subject: data.subject,
                html: html,
                text: this.htmlToText(html), // Fallback text version
                ...options
            };

            // Send email
            const result = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${data.recipient_email}`);
            return result;

        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    async sendABTestEmail(templateName, data, testConfig) {
        // Determine variant based on user ID or random selection
        const variant = this.determineVariant(data.user_id, testConfig);
        
        // Add A/B test data to email data
        const abTestData = {
            ...data,
            ab_variant: variant,
            ab_test_id: testConfig.testId
        };

        // Send email with variant
        return await this.sendEmail(templateName, abTestData);
    }

    determineVariant(userId, testConfig) {
        // Simple hash-based variant selection
        const hash = this.simpleHash(userId + testConfig.testId);
        return hash % 2 === 0 ? 'A' : 'B';
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    htmlToText(html) {
        // Simple HTML to text conversion
        return html
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
    }

    createMJMLTemplate(templateName, mjmlContent) {
        const { html } = mjml(mjmlContent);
        const template = handlebars.compile(html);
        this.templates.set(templateName, template);
        return template;
    }

    async sendBulkEmails(templateName, recipients, dataGenerator) {
        const results = [];
        
        for (const recipient of recipients) {
            try {
                const data = dataGenerator(recipient);
                const result = await this.sendEmail(templateName, data);
                results.push({ success: true, recipient, result });
            } catch (error) {
                results.push({ success: false, recipient, error: error.message });
            }
        }

        return results;
    }

    async sendTransactionalEmail(type, data) {
        const templateMap = {
            'welcome': 'welcome-email',
            'order_confirmation': 'order-confirmation',
            'password_reset': 'password-reset',
            'newsletter': 'newsletter',
            'promotional': 'promotional'
        };

        const templateName = templateMap[type];
        if (!templateName) {
            throw new Error(`Unknown email type: ${type}`);
        }

        return await this.sendEmail(templateName, data);
    }
}

// Example email templates
const createSampleTemplates = () => {
    const templatesDir = './templates';
    
    if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
    }

    // Welcome email template
    const welcomeTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{company.name}}</title>
    <style>
        .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; line-height: 1.6; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to {{company.name}}!</h1>
        </div>
        <div class="content">
            <h2>Hello {{customer_name}},</h2>
            <p>Thank you for joining {{company.name}}! We're excited to have you as part of our community.</p>
            
            <div class="highlight">
                <strong>Your account details:</strong><br>
                Email: {{customer_email}}<br>
                Member since: {{formatDate join_date}}
            </div>

            <p>Here's what you can do to get started:</p>
            <ul>
                <li>Complete your profile</li>
                <li>Explore our features</li>
                <li>Connect with other members</li>
            </ul>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{dashboard_url}}" class="button">Get Started</a>
            </p>

            <p>If you have any questions, feel free to contact our support team at {{company.support_email}}.</p>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company.name}}. All rights reserved.</p>
            <p><a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="{{preferences_url}}">Email Preferences</a></p>
        </div>
    </div>
</body>
</html>`;

    // Order confirmation template
    const orderTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - {{order_number}}</title>
    <style>
        .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; line-height: 1.6; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; }
        .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .order-table th, .order-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        .order-table th { background: #f8f9fa; }
        .total { font-weight: bold; font-size: 18px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Order Confirmation</h1>
            <p>Order #{{order_number}}</p>
        </div>
        <div class="content">
            <h2>Thank you for your order, {{customer_name}}!</h2>
            <p>We've received your order and it's being processed. Here are the details:</p>
            
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each order_items}}
                    <tr>
                        <td>{{name}}</td>
                        <td>{{quantity}}</td>
                        <td>{{formatCurrency unit_price}}</td>
                        <td>{{formatCurrency (math quantity "*" unit_price)}}</td>
                    </tr>
                    {{/each}}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                        <td>{{formatCurrency subtotal}}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Tax:</strong></td>
                        <td>{{formatCurrency tax}}</td>
                    </tr>
                    <tr class="total">
                        <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                        <td>{{formatCurrency total}}</td>
                    </tr>
                </tfoot>
            </table>

            <p><strong>Shipping Address:</strong><br>
            {{shipping_address.street}}<br>
            {{shipping_address.city}}, {{shipping_address.state}} {{shipping_address.zip}}</p>

            <p>You can track your order status at any time by visiting your account dashboard.</p>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company.name}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    // A/B Test promotional template
    const promotionalTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{abTest ab_variant variantA="Special Offer Just for You!" variantB="Limited Time Deal - Don't Miss Out!"}}</title>
    <style>
        .email-container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: {{abTest ab_variant variantA="#007bff" variantB="#dc3545"}}; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; line-height: 1.6; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; }
        .cta-button { display: inline-block; padding: 15px 30px; background: {{abTest ab_variant variantA="#007bff" variantB="#dc3545"}}; color: white; text-decoration: none; border-radius: 4px; font-size: 18px; font-weight: bold; }
        .offer-box { background: #fff3cd; padding: 20px; border: 2px solid #ffc107; border-radius: 8px; margin: 20px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>{{abTest ab_variant variantA="Special Offer Just for You!" variantB="Limited Time Deal - Don't Miss Out!"}}</h1>
        </div>
        <div class="content">
            <h2>Hello {{customer_name}},</h2>
            <p>{{abTest ab_variant variantA="We've prepared a special offer just for you!" variantB="This exclusive deal won't last long!"}}</p>
            
            <div class="offer-box">
                <h3>{{abTest ab_variant variantA="Get 20% Off Your Next Purchase" variantB="Save Big on Premium Products"}}</h3>
                <p>Use code: <strong>{{promo_code}}</strong></p>
                <p>Valid until {{formatDate expiry_date}}</p>
            </div>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{cta_url}}" class="cta-button">
                    {{abTest ab_variant variantA="Get 20% Off Now" variantB="Claim Your Discount"}}
                </a>
            </p>

            <p>{{abTest ab_variant variantA="Don't miss this exclusive opportunity!" variantB="Act fast - this offer expires soon!"}}</p>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company.name}}. All rights reserved.</p>
            <p><a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="{{preferences_url}}">Email Preferences</a></p>
        </div>
    </div>
</body>
</html>`;

    // Write templates to files
    fs.writeFileSync(path.join(templatesDir, 'welcome-email.hbs'), welcomeTemplate);
    fs.writeFileSync(path.join(templatesDir, 'order-confirmation.hbs'), orderTemplate);
    fs.writeFileSync(path.join(templatesDir, 'promotional.hbs'), promotionalTemplate);

    console.log('Sample templates created successfully');
};

// Example usage
async function runEmailExamples() {
    // Create sample templates
    createSampleTemplates();

    // Initialize email system
    const emailSystem = new EmailTemplateSystem({
        defaultFrom: 'noreply@techcorp.com'
    });

    // Example 1: Welcome email
    const welcomeData = {
        recipient_email: 'customer@example.com',
        subject: 'Welcome to TechCorp Solutions!',
        customer_name: 'John Doe',
        customer_email: 'john.doe@example.com',
        join_date: new Date(),
        dashboard_url: 'https://techcorp.com/dashboard',
        unsubscribe_url: 'https://techcorp.com/unsubscribe',
        preferences_url: 'https://techcorp.com/preferences'
    };

    // Example 2: Order confirmation
    const orderData = {
        recipient_email: 'customer@example.com',
        subject: 'Order Confirmation - ORD-2024-001',
        customer_name: 'Jane Smith',
        order_number: 'ORD-2024-001',
        order_items: [
            { name: 'Premium Widget', quantity: 2, unit_price: 29.99 },
            { name: 'Super Gadget', quantity: 1, unit_price: 49.99 }
        ],
        subtotal: 109.97,
        tax: 9.35,
        total: 119.32,
        shipping_address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '90210'
        }
    };

    // Example 3: A/B Test promotional email
    const promotionalData = {
        recipient_email: 'customer@example.com',
        customer_name: 'Bob Johnson',
        user_id: 'user_123',
        promo_code: 'SAVE20',
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        cta_url: 'https://techcorp.com/shop',
        unsubscribe_url: 'https://techcorp.com/unsubscribe',
        preferences_url: 'https://techcorp.com/preferences'
    };

    const abTestConfig = {
        testId: 'promo_2024_q1',
        variants: ['A', 'B']
    };

    try {
        // Send welcome email
        console.log('Sending welcome email...');
        // await emailSystem.sendEmail('welcome-email', welcomeData);

        // Send order confirmation
        console.log('Sending order confirmation...');
        // await emailSystem.sendEmail('order-confirmation', orderData);

        // Send A/B test promotional email
        console.log('Sending A/B test promotional email...');
        // await emailSystem.sendABTestEmail('promotional', promotionalData, abTestConfig);

        console.log('All email examples completed successfully!');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}

// Export for use in other modules
module.exports = {
    EmailTemplateSystem,
    createSampleTemplates,
    runEmailExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
    runEmailExamples();
}
