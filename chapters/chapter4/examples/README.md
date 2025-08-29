# Chapter 4: Templates for Documents and Emails - Examples

This directory contains practical examples demonstrating document and email template generation, covering PDF generation, Word documents, email templates, and document automation workflows.

## 📁 File Structure

```
examples/
├── README.md                           # This file
├── pdf-invoice-generator.js           # PDF invoice generation with PDFKit
├── email-template-system.js           # Email templating with Nodemailer & Handlebars
├── word-document-generator.py         # Word document generation with python-docx
└── document-workflow-automation.js    # Document workflow automation system
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Python** (3.8 or higher) - for Word document generation
3. **Required Node.js packages** (install with `npm install`):
   - `pdfkit` - PDF generation
   - `nodemailer` - Email sending
   - `handlebars` - Template engine
   - `mjml` - Responsive email framework
   - `express` - Web framework (for API examples)

4. **Required Python packages** (install with `pip install -r requirements.txt`):
   - `python-docx` - Word document manipulation
   - `docxtpl` - Word document templating

### Installation

```bash
# Install Node.js dependencies
npm install pdfkit nodemailer handlebars mjml express

# Install Python dependencies
pip install python-docx docxtpl
```

## 📄 Example 1: PDF Invoice Generator

**File:** `pdf-invoice-generator.js`

### What it demonstrates:
- Professional PDF invoice generation using PDFKit
- Dynamic table creation with proper formatting
- Currency and date formatting
- Company and client information layout
- Tax calculations and totals
- Payment instructions

### How to run:

```bash
node pdf-invoice-generator.js
```

### Features:
- **InvoiceGenerator class** with comprehensive invoice layout
- **Dynamic content insertion** for company, client, and line items
- **Professional formatting** with proper spacing and typography
- **Calculations** for subtotals, taxes, and totals
- **Payment information** section with banking details

### Example output:
Generates a professional PDF invoice with:
- Company header with logo placeholder
- Client billing information
- Itemized line items with calculations
- Tax and total calculations
- Payment instructions

## 📧 Example 2: Email Template System

**File:** `email-template-system.js`

### What it demonstrates:
- Complete email templating system with Handlebars
- A/B testing capabilities for email campaigns
- Responsive email design with MJML
- Custom Handlebars helpers for formatting
- Bulk email processing
- Template management and loading

### How to run:

```bash
node email-template-system.js
```

### Features:
- **EmailTemplateSystem class** with comprehensive email management
- **Template loading** from `.hbs` files
- **Custom helpers** for date, currency, and conditional formatting
- **A/B testing** with variant selection
- **Responsive design** using MJML
- **Bulk email processing** with error handling

### Templates included:
1. **Welcome Email** - New user onboarding
2. **Order Confirmation** - E-commerce order details
3. **Promotional Email** - A/B tested marketing campaigns

### Example usage:

```javascript
const emailSystem = new EmailTemplateSystem();

// Send welcome email
await emailSystem.sendEmail('welcome-email', {
    recipient_email: 'user@example.com',
    customer_name: 'John Doe',
    join_date: new Date()
});

// Send A/B test email
await emailSystem.sendABTestEmail('promotional', data, {
    testId: 'campaign_001',
    variants: ['A', 'B']
});
```

## 📝 Example 3: Word Document Generator

**File:** `word-document-generator.py`

### What it demonstrates:
- Word document generation using python-docx and docxtpl
- Template-based contract generation
- Programmatic report creation
- Dynamic table and list generation
- Conditional content based on data

### How to run:

```bash
python word-document-generator.py
```

### Features:
- **WordDocumentGenerator class** with multiple document types
- **Template-based generation** for contracts
- **Programmatic creation** for reports and letters
- **Dynamic tables** with proper formatting
- **Conditional content** based on document status
- **Professional formatting** with styles and layouts

### Document types:
1. **Contracts** - Service agreements with milestones
2. **Reports** - Project status reports with metrics
3. **Letters** - Business correspondence

### Example usage:

```python
generator = WordDocumentGenerator()

# Generate contract
contract_path = generator.generate_contract({
    'client_name': 'Acme Corp',
    'project_name': 'Website Redesign',
    'amount': 50000.00,
    'start_date': '2024-01-15',
    'end_date': '2024-06-15'
})

# Generate report
report_path = generator.generate_report({
    'title': 'Q1 2024 Project Report',
    'project_name': 'E-commerce Platform',
    'metrics': {...},
    'financials': [...]
})
```

## ⚙️ Example 4: Document Workflow Automation

**File:** `document-workflow-automation.js`

### What it demonstrates:
- Complete document workflow automation system
- Job queue management with priorities
- Batch processing capabilities
- REST API for document generation
- Error handling and retry logic
- Database integration patterns

### How to run:

```bash
node document-workflow-automation.js
```

### Features:
- **DocumentWorkflowAutomation class** with job management
- **Priority-based job queue** with concurrent processing
- **Multiple workflow types**: invoices, contracts, reports, email campaigns
- **REST API** for job submission and monitoring
- **Error handling** with retry mechanisms
- **Batch processing** for multiple documents

### Workflow types:
1. **Invoice Workflow** - Generate PDF and send email
2. **Contract Workflow** - Create Word document with notifications
3. **Report Workflow** - Generate reports with metadata
4. **Email Campaign** - Bulk email with A/B testing
5. **Document Batch** - Process multiple documents

### API Endpoints:
- `POST /api/jobs` - Submit new job
- `GET /api/jobs/:jobId` - Get job status
- `GET /api/queue/status` - Get queue status
- `DELETE /api/jobs/:jobId` - Cancel job
- `POST /api/documents/generate` - Generate document directly

### Example usage:

```javascript
const workflow = new DocumentWorkflowAutomation();

// Submit invoice job
const jobId = await workflow.addJob({
    type: 'invoice',
    data: { invoice: {...}, customer: {...} },
    priority: 'high'
});

// Monitor job status
const status = workflow.getJobStatus(jobId);
console.log(`Job ${jobId}: ${status.status}`);
```

## 🔧 Configuration

### Environment Variables

For email functionality, set these environment variables:

```bash
# Email configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Customization

Each example can be customized by modifying:

1. **Templates** - Edit template files in the `templates/` directory
2. **Styling** - Modify CSS and formatting in templates
3. **Data sources** - Connect to databases or APIs for dynamic data
4. **Output formats** - Add support for additional document types

## 📊 Performance Considerations

### PDF Generation
- **Caching**: Cache compiled templates for better performance
- **Batch processing**: Process multiple documents in batches
- **Memory management**: Close PDF documents properly

### Email System
- **Rate limiting**: Implement rate limiting for email sending
- **Queue management**: Use message queues for high-volume sending
- **Template caching**: Cache compiled Handlebars templates

### Word Documents
- **Template reuse**: Reuse document templates for consistency
- **Batch processing**: Generate multiple documents efficiently
- **Memory optimization**: Close documents after generation

## 🛡️ Security Best Practices

### Input Validation
- Validate all template data before processing
- Sanitize user inputs to prevent injection attacks
- Use parameterized queries for database operations

### Access Control
- Implement proper authentication for API endpoints
- Use role-based access control for document generation
- Audit all document generation activities

### Data Protection
- Encrypt sensitive documents in storage
- Use secure transmission for email delivery
- Implement proper logging and monitoring

## 🧪 Testing

### Unit Tests
Each example includes testable components:

```javascript
// Test PDF generation
const generator = new InvoiceGenerator();
const result = generator.generateInvoice(testData);
assert(result.includes('INVOICE'));

// Test email templates
const emailSystem = new EmailTemplateSystem();
const html = emailSystem.renderTemplate('welcome', testData);
assert(html.includes('Welcome'));
```

### Integration Tests
Test complete workflows:

```javascript
// Test complete invoice workflow
const workflow = new DocumentWorkflowAutomation();
const jobId = await workflow.addJob({ type: 'invoice', data: testData });
const result = await workflow.getJobStatus(jobId);
assert(result.status === 'completed');
```

## 📚 Learning Path

1. **Start with PDF Invoice Generator** - Learn basic PDF generation
2. **Explore Email Template System** - Understand email templating
3. **Study Word Document Generator** - Learn document automation
4. **Master Workflow Automation** - Build complete systems

## 🔗 Related Resources

- [PDFKit Documentation](https://pdfkit.org/)
- [Handlebars Documentation](https://handlebarsjs.com/)
- [MJML Documentation](https://mjml.io/)
- [python-docx Documentation](https://python-docx.readthedocs.io/)
- [Nodemailer Documentation](https://nodemailer.com/)

## 🤝 Contributing

To extend these examples:

1. **Add new document types** - Create new workflow types
2. **Enhance templates** - Add more sophisticated layouts
3. **Improve error handling** - Add better error recovery
4. **Add tests** - Create comprehensive test suites

## 📄 License

These examples are part of the "Mastering Template Generation" book project and are provided for educational purposes.
