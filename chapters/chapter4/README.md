# Chapter 4: Templates for Documents and Emails

## Overview

This chapter explores how templates are used for document generation and email automation. We'll cover PDF generation, Word document templates, email templating systems, and document automation workflows that are essential for business applications.

## Table of Contents

1. [Document Template Fundamentals](#document-template-fundamentals)
2. [PDF Generation with Templates](#pdf-generation-with-templates)
3. [Word Document Templates](#word-document-templates)
4. [Email Templates](#email-templates)
5. [Document Automation Workflows](#document-automation-workflows)
6. [Advanced Document Features](#advanced-document-features)
7. [Best Practices](#best-practices)

## Document Template Fundamentals

### What are Document Templates?

Document templates are pre-designed layouts that contain placeholders for dynamic content. They enable the automated generation of consistent documents like:

- **Business Documents**: Invoices, contracts, reports
- **Personal Documents**: Certificates, letters, resumes
- **Marketing Materials**: Brochures, flyers, presentations
- **Technical Documents**: API documentation, user manuals

### Key Components

1. **Layout Structure**: The visual design and formatting
2. **Content Placeholders**: Dynamic fields for data insertion
3. **Conditional Logic**: Rules for showing/hiding content
4. **Styling**: Typography, colors, spacing, and branding

### Document Template Types

| Type | Description | Use Cases |
|------|-------------|-----------|
| **PDF Templates** | Vector-based, print-ready documents | Invoices, certificates, reports |
| **Word Templates** | Rich text documents with formatting | Contracts, letters, proposals |
| **Email Templates** | HTML/text email layouts | Newsletters, notifications, marketing |
| **HTML Templates** | Web-based document generation | Reports, dashboards, presentations |

## PDF Generation with Templates

### PDF Generation Libraries

#### JavaScript/Node.js
- **PDFKit**: Low-level PDF generation
- **Puppeteer**: HTML to PDF conversion
- **jsPDF**: Client-side PDF generation
- **PDF-lib**: PDF manipulation and creation

#### Python
- **ReportLab**: Professional PDF generation
- **WeasyPrint**: HTML/CSS to PDF
- **PyPDF2**: PDF manipulation
- **pdfkit**: wkhtmltopdf wrapper

### PDF Template Patterns

#### 1. Layout-Based Templates
```javascript
// Using PDFKit for structured layouts
const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoice(data) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('invoice.pdf'));
  
  // Header
  doc.fontSize(24).text('INVOICE', {align: 'center'});
  doc.moveDown();
  
  // Company info
  doc.fontSize(12).text(data.company.name);
  doc.fontSize(10).text(data.company.address);
  
  // Invoice details
  doc.moveDown();
  doc.fontSize(14).text(`Invoice #: ${data.invoiceNumber}`);
  doc.text(`Date: ${data.date}`);
  
  // Items table
  // ... table generation logic
  
  doc.end();
}
```

#### 2. HTML-to-PDF Templates
```javascript
// Using Puppeteer for HTML-based templates
const puppeteer = require('puppeteer');

async function generatePDFFromHTML(htmlTemplate, data) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Render template with data
  const renderedHTML = renderTemplate(htmlTemplate, data);
  await page.setContent(renderedHTML);
  
  // Generate PDF
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
  });
  
  await browser.close();
  return pdf;
}
```

### Advanced PDF Features

#### 1. Dynamic Tables
```javascript
function createDynamicTable(doc, data, startY) {
  let currentY = startY;
  const tableWidth = 500;
  const colWidths = [100, 200, 100, 100];
  
  // Header
  doc.fontSize(12).font('Helvetica-Bold');
  ['Item', 'Description', 'Quantity', 'Price'].forEach((header, i) => {
    doc.text(header, 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), currentY);
  });
  
  currentY += 20;
  
  // Rows
  doc.fontSize(10).font('Helvetica');
  data.forEach(item => {
    doc.text(item.name, 50, currentY);
    doc.text(item.description, 150, currentY);
    doc.text(item.quantity.toString(), 350, currentY);
    doc.text(`$${item.price.toFixed(2)}`, 450, currentY);
    currentY += 15;
  });
  
  return currentY;
}
```

#### 2. Charts and Graphics
```javascript
function addChart(doc, chartData, x, y) {
  const chartWidth = 300;
  const chartHeight = 200;
  
  // Draw chart background
  doc.rect(x, y, chartWidth, chartHeight).stroke();
  
  // Calculate bar positions
  const barWidth = chartWidth / chartData.length;
  const maxValue = Math.max(...chartData.map(d => d.value));
  
  chartData.forEach((item, i) => {
    const barHeight = (item.value / maxValue) * chartHeight;
    const barX = x + (i * barWidth) + 10;
    const barY = y + chartHeight - barHeight;
    
    doc.rect(barX, barY, barWidth - 20, barHeight).fill('blue');
    doc.text(item.label, barX, y + chartHeight + 10);
  });
}
```

## Word Document Templates

### Word Document Libraries

#### JavaScript/Node.js
- **docx**: Create Word documents programmatically
- **officegen**: Generate Office documents
- **mammoth**: Convert Word to HTML

#### Python
- **python-docx**: Create and modify Word documents
- **docxtpl**: Template-based Word generation
- **python-docx-template**: Advanced templating

### Word Template Patterns

#### 1. Template-Based Generation
```python
from docxtpl import DocxTemplate
from datetime import datetime

def generate_contract(data):
    # Load template
    doc = DocxTemplate("contract_template.docx")
    
    # Prepare context data
    context = {
        'client_name': data['client_name'],
        'project_name': data['project_name'],
        'start_date': data['start_date'],
        'end_date': data['end_date'],
        'total_amount': f"${data['amount']:,.2f}",
        'current_date': datetime.now().strftime("%B %d, %Y"),
        'terms': data['terms'],
        'milestones': data['milestones']
    }
    
    # Render template
    doc.render(context)
    
    # Save generated document
    doc.save(f"contract_{data['client_name'].replace(' ', '_')}.docx")
```

#### 2. Programmatic Document Creation
```python
from docx import Document
from docx.shared import Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def create_report(data):
    doc = Document()
    
    # Title
    title = doc.add_heading('Project Report', 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Executive Summary
    doc.add_heading('Executive Summary', level=1)
    doc.add_paragraph(data['summary'])
    
    # Project Details
    doc.add_heading('Project Details', level=1)
    
    # Create table
    table = doc.add_table(rows=1, cols=2)
    table.style = 'Table Grid'
    
    # Add headers
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = 'Metric'
    hdr_cells[1].text = 'Value'
    
    # Add data rows
    for metric, value in data['metrics'].items():
        row_cells = table.add_row().cells
        row_cells[0].text = metric
        row_cells[1].text = str(value)
    
    return doc
```

### Advanced Word Features

#### 1. Conditional Content
```python
def generate_conditional_report(data):
    doc = DocxTemplate("report_template.docx")
    
    context = {
        'project_name': data['name'],
        'status': data['status'],
        'show_financials': data['include_financials'],
        'financial_data': data['financials'] if data['include_financials'] else [],
        'show_risks': data['status'] == 'At Risk',
        'risk_mitigation': data['risk_plan'] if data['status'] == 'At Risk' else []
    }
    
    doc.render(context)
    return doc
```

#### 2. Dynamic Tables and Lists
```python
def create_dynamic_table(doc, data, headers):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = 'Table Grid'
    
    # Add headers
    hdr_cells = table.rows[0].cells
    for i, header in enumerate(headers):
        hdr_cells[i].text = header
    
    # Add data rows
    for row_data in data:
        row_cells = table.add_row().cells
        for i, value in enumerate(row_data):
            row_cells[i].text = str(value)
    
    return table
```

## Email Templates

### Email Template Systems

#### JavaScript/Node.js
- **Nodemailer**: Email sending with template support
- **MJML**: Responsive email framework
- **Handlebars**: Template engine for emails
- **Email-templates**: Complete email templating solution

#### Python
- **Jinja2**: Template engine for emails
- **Flask-Mail**: Email integration for Flask
- **Django Templates**: Built-in templating for Django

### Email Template Patterns

#### 1. HTML Email Templates
```javascript
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');

// Email template
const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: #007bff; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>{{company_name}}</h1>
        </div>
        <div class="content">
            <h2>Hello {{customer_name}},</h2>
            <p>{{message}}</p>
            {{#if order_details}}
            <h3>Order Details:</h3>
            <ul>
                {{#each order_details}}
                <li>{{name}} - ${{price}}</li>
                {{/each}}
            </ul>
            {{/if}}
            <p>Best regards,<br>{{company_name}} Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company_name}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

// Compile template
const template = handlebars.compile(emailTemplate);

// Send email
async function sendEmail(data) {
    const transporter = nodemailer.createTransporter({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const html = template({
        ...data,
        year: new Date().getFullYear()
    });
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: data.recipient_email,
        subject: data.subject,
        html: html
    };
    
    return await transporter.sendMail(mailOptions);
}
```

#### 2. Responsive Email with MJML
```javascript
const mjml = require('mjml');

const mjmlTemplate = `
<mjml>
  <mj-head>
    <mj-title>{{subject}}</mj-title>
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto" />
    <mj-attributes>
      <mj-all font-family="Roboto, Arial" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-section background-color="#f4f4f4">
      <mj-column>
        <mj-text font-size="20px" color="#626262" align="center">
          {{company_name}}
        </mj-text>
      </mj-column>
    </mj-section>
    
    <mj-section background-color="#ffffff">
      <mj-column>
        <mj-text font-size="16px" color="#626262">
          Hello {{customer_name}},
        </mj-text>
        <mj-text font-size="14px" color="#626262" line-height="24px">
          {{message}}
        </mj-text>
        {{#if cta_url}}
        <mj-button background-color="#007bff" color="white" href="{{cta_url}}">
          {{cta_text}}
        </mj-button>
        {{/if}}
      </mj-column>
    </mj-section>
    
    <mj-section background-color="#f4f4f4">
      <mj-column>
        <mj-text font-size="12px" color="#626262" align="center">
          &copy; {{year}} {{company_name}}. All rights reserved.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

function generateEmailHTML(data) {
    const template = handlebars.compile(mjmlTemplate);
    const mjmlContent = template({
        ...data,
        year: new Date().getFullYear()
    });
    
    const { html } = mjml(mjmlContent);
    return html;
}
```

### Email Template Features

#### 1. Personalization
```javascript
function personalizeEmail(template, userData) {
    return template
        .replace(/\{\{name\}\}/g, userData.name)
        .replace(/\{\{email\}\}/g, userData.email)
        .replace(/\{\{company\}\}/g, userData.company)
        .replace(/\{\{preferences\}\}/g, userData.preferences.join(', '));
}
```

#### 2. A/B Testing Support
```javascript
function generateABTestEmail(template, variant) {
    const variants = {
        'A': {
            subject: 'Special Offer Just for You!',
            cta_text: 'Get 20% Off Now',
            cta_color: '#007bff'
        },
        'B': {
            subject: 'Limited Time Deal - Don\'t Miss Out!',
            cta_text: 'Claim Your Discount',
            cta_color: '#dc3545'
        }
    };
    
    return {
        ...template,
        ...variants[variant]
    };
}
```

## Document Automation Workflows

### Workflow Patterns

#### 1. Batch Processing
```javascript
async function processBatchDocuments(template, dataArray) {
    const results = [];
    
    for (const data of dataArray) {
        try {
            const document = await generateDocument(template, data);
            const filename = `document_${data.id}_${Date.now()}.pdf`;
            
            await saveDocument(document, filename);
            results.push({ success: true, filename, data });
        } catch (error) {
            results.push({ success: false, error: error.message, data });
        }
    }
    
    return results;
}
```

#### 2. Conditional Workflows
```javascript
async function processDocumentWorkflow(data) {
    const workflow = {
        'invoice': async (data) => {
            const template = await loadTemplate('invoice');
            const document = await generatePDF(template, data);
            await sendEmail(data.customer_email, document);
            return document;
        },
        'contract': async (data) => {
            const template = await loadTemplate('contract');
            const document = await generateWord(template, data);
            await storeDocument(document, data.client_id);
            return document;
        },
        'report': async (data) => {
            const template = await loadTemplate('report');
            const document = await generatePDF(template, data);
            await uploadToCloud(document);
            return document;
        }
    };
    
    const processor = workflow[data.document_type];
    if (!processor) {
        throw new Error(`Unknown document type: ${data.document_type}`);
    }
    
    return await processor(data);
}
```

### Integration Patterns

#### 1. Database Integration
```javascript
async function generateDocumentsFromDatabase() {
    const db = await connectDatabase();
    
    // Get pending documents
    const pendingDocs = await db.query(`
        SELECT * FROM document_queue 
        WHERE status = 'pending' 
        ORDER BY priority DESC, created_at ASC
    `);
    
    for (const doc of pendingDocs) {
        try {
            // Update status to processing
            await db.query(
                'UPDATE document_queue SET status = ? WHERE id = ?',
                ['processing', doc.id]
            );
            
            // Generate document
            const result = await processDocumentWorkflow(doc);
            
            // Update status to completed
            await db.query(
                'UPDATE document_queue SET status = ?, result_path = ? WHERE id = ?',
                ['completed', result.path, doc.id]
            );
        } catch (error) {
            // Update status to failed
            await db.query(
                'UPDATE document_queue SET status = ?, error_message = ? WHERE id = ?',
                ['failed', error.message, doc.id]
            );
        }
    }
}
```

#### 2. API Integration
```javascript
const express = require('express');
const app = express();

app.post('/api/documents/generate', async (req, res) => {
    try {
        const { template_type, data, format } = req.body;
        
        // Validate request
        if (!template_type || !data) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Generate document
        const document = await generateDocument(template_type, data, format);
        
        // Return document or save to storage
        if (format === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
            res.send(document);
        } else {
            res.json({ 
                success: true, 
                document_url: await uploadToStorage(document),
                document_id: generateId()
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## Advanced Document Features

### 1. Digital Signatures
```javascript
const crypto = require('crypto');
const fs = require('fs');

function addDigitalSignature(document, privateKey) {
    const hash = crypto.createHash('sha256').update(document).digest('hex');
    const signature = crypto.sign('sha256', Buffer.from(hash), privateKey);
    
    return {
        document: document,
        signature: signature.toString('base64'),
        timestamp: new Date().toISOString(),
        hash: hash
    };
}

function verifyDigitalSignature(signedDocument, publicKey) {
    const hash = crypto.createHash('sha256').update(signedDocument.document).digest('hex');
    const signature = Buffer.from(signedDocument.signature, 'base64');
    
    return crypto.verify('sha256', Buffer.from(hash), publicKey, signature);
}
```

### 2. Watermarking
```javascript
function addWatermark(pdfDocument, watermarkText) {
    const watermark = {
        text: watermarkText,
        opacity: 0.3,
        rotation: -45,
        fontSize: 24,
        color: '#cccccc'
    };
    
    // Add watermark to each page
    pdfDocument.pages.forEach(page => {
        page.drawText(watermark.text, {
            x: page.getWidth() / 2,
            y: page.getHeight() / 2,
            size: watermark.fontSize,
            color: rgb(0.8, 0.8, 0.8),
            opacity: watermark.opacity,
            rotate: degrees(watermark.rotation)
        });
    });
    
    return pdfDocument;
}
```

### 3. Document Versioning
```javascript
class DocumentVersionManager {
    constructor() {
        this.versions = new Map();
    }
    
    createVersion(document, metadata) {
        const version = {
            id: generateId(),
            document: document,
            metadata: {
                ...metadata,
                created_at: new Date(),
                version_number: this.getNextVersionNumber(metadata.document_id)
            }
        };
        
        if (!this.versions.has(metadata.document_id)) {
            this.versions.set(metadata.document_id, []);
        }
        
        this.versions.get(metadata.document_id).push(version);
        return version;
    }
    
    getVersion(documentId, versionNumber) {
        const versions = this.versions.get(documentId);
        if (!versions) return null;
        
        return versions.find(v => v.metadata.version_number === versionNumber);
    }
    
    getLatestVersion(documentId) {
        const versions = this.versions.get(documentId);
        if (!versions || versions.length === 0) return null;
        
        return versions[versions.length - 1];
    }
    
    getNextVersionNumber(documentId) {
        const versions = this.versions.get(documentId);
        return versions ? versions.length + 1 : 1;
    }
}
```

## Best Practices

### 1. Template Design
- **Consistency**: Use consistent styling and formatting
- **Modularity**: Break templates into reusable components
- **Accessibility**: Ensure documents are accessible to all users
- **Branding**: Maintain consistent brand identity across all documents

### 2. Performance Optimization
- **Caching**: Cache compiled templates for better performance
- **Batch Processing**: Process multiple documents in batches
- **Async Processing**: Use asynchronous operations for better responsiveness
- **Resource Management**: Properly close file handles and connections

### 3. Security Considerations
- **Input Validation**: Validate all template data
- **Access Control**: Implement proper access controls for document generation
- **Audit Logging**: Log all document generation activities
- **Secure Storage**: Store sensitive documents securely

### 4. Error Handling
- **Graceful Degradation**: Handle errors without crashing the system
- **User Feedback**: Provide clear error messages to users
- **Retry Logic**: Implement retry mechanisms for transient failures
- **Monitoring**: Monitor document generation processes

### 5. Testing
- **Unit Tests**: Test individual template components
- **Integration Tests**: Test complete document generation workflows
- **Visual Regression Tests**: Ensure document appearance consistency
- **Performance Tests**: Test document generation performance under load

## Summary

This chapter covered the essential aspects of document and email templating:

1. **Document Template Fundamentals**: Understanding the structure and components of document templates
2. **PDF Generation**: Creating PDFs using various libraries and techniques
3. **Word Document Templates**: Generating Word documents with templates
4. **Email Templates**: Building responsive and personalized email templates
5. **Document Automation**: Implementing automated document generation workflows
6. **Advanced Features**: Digital signatures, watermarking, and versioning
7. **Best Practices**: Design, performance, security, and testing considerations

The examples provided demonstrate practical implementations that can be adapted for real-world applications. The next chapter will explore code generation with templates, showing how templates can be used to generate application code, configuration files, and other technical artifacts.

## Exercises

1. **Invoice Generator**: Create a PDF invoice generator that supports multiple currencies and tax calculations
2. **Email Campaign System**: Build an email templating system with A/B testing capabilities
3. **Document Workflow**: Implement a document approval workflow with digital signatures
4. **Template Designer**: Create a web-based template designer for non-technical users
5. **Performance Optimization**: Optimize a document generation system for high-volume processing

## Resources

- [PDFKit Documentation](https://pdfkit.org/)
- [python-docx Documentation](https://python-docx.readthedocs.io/)
- [MJML Documentation](https://mjml.io/documentation/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Document Generation Best Practices](https://www.example.com/document-generation-guide)
