const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class InvoiceGenerator {
    constructor() {
        this.doc = null;
        this.currentY = 0;
        this.margin = 50;
        this.pageWidth = 595.28; // A4 width in points
        this.contentWidth = this.pageWidth - (this.margin * 2);
    }

    generateInvoice(invoiceData, outputPath = 'invoice.pdf') {
        this.doc = new PDFDocument({
            size: 'A4',
            margin: this.margin
        });

        // Pipe to file
        this.doc.pipe(fs.createWriteStream(outputPath));

        // Set initial position
        this.currentY = this.margin;

        // Generate invoice content
        this.addHeader(invoiceData);
        this.addCompanyInfo(invoiceData.company);
        this.addClientInfo(invoiceData.client);
        this.addInvoiceDetails(invoiceData);
        this.addItemsTable(invoiceData.items);
        this.addTotals(invoiceData);
        this.addFooter(invoiceData);

        // Finalize document
        this.doc.end();

        return outputPath;
    }

    addHeader(invoiceData) {
        // Title
        this.doc.fontSize(24)
            .font('Helvetica-Bold')
            .text('INVOICE', this.margin, this.currentY, { align: 'center' });
        
        this.currentY += 40;

        // Invoice number and date
        this.doc.fontSize(12)
            .font('Helvetica')
            .text(`Invoice #: ${invoiceData.invoiceNumber}`, this.margin, this.currentY);
        
        this.doc.fontSize(12)
            .text(`Date: ${this.formatDate(invoiceData.date)}`, this.pageWidth - this.margin - 100, this.currentY);
        
        this.currentY += 30;
    }

    addCompanyInfo(company) {
        // Company logo placeholder
        this.doc.rect(this.margin, this.currentY, 60, 60)
            .stroke()
            .fontSize(8)
            .text('LOGO', this.margin + 20, this.currentY + 25);

        // Company details
        this.doc.fontSize(14)
            .font('Helvetica-Bold')
            .text(company.name, this.margin + 80, this.currentY);
        
        this.doc.fontSize(10)
            .font('Helvetica')
            .text(company.address.street, this.margin + 80, this.currentY + 20)
            .text(`${company.address.city}, ${company.address.state} ${company.address.zip}`, this.margin + 80, this.currentY + 35)
            .text(company.phone, this.margin + 80, this.currentY + 50)
            .text(company.email, this.margin + 80, this.currentY + 65);

        this.currentY += 100;
    }

    addClientInfo(client) {
        // Bill to section
        this.doc.fontSize(12)
            .font('Helvetica-Bold')
            .text('Bill To:', this.margin, this.currentY);
        
        this.currentY += 15;

        this.doc.fontSize(10)
            .font('Helvetica')
            .text(client.name, this.margin, this.currentY)
            .text(client.address.street, this.margin, this.currentY + 15)
            .text(`${client.address.city}, ${client.address.state} ${client.address.zip}`, this.margin, this.currentY + 30)
            .text(client.email, this.margin, this.currentY + 45);

        this.currentY += 80;
    }

    addInvoiceDetails(invoiceData) {
        // Payment terms
        this.doc.fontSize(10)
            .font('Helvetica')
            .text(`Payment Terms: ${invoiceData.paymentTerms}`, this.margin, this.currentY)
            .text(`Due Date: ${this.formatDate(invoiceData.dueDate)}`, this.margin, this.currentY + 15);

        this.currentY += 40;
    }

    addItemsTable(invoiceData) {
        const tableTop = this.currentY;
        const itemCodeWidth = 80;
        const descriptionWidth = 200;
        const quantityWidth = 80;
        const unitPriceWidth = 80;
        const totalWidth = 80;

        // Table headers
        this.doc.fontSize(10)
            .font('Helvetica-Bold')
            .text('Item Code', this.margin, tableTop)
            .text('Description', this.margin + itemCodeWidth, tableTop)
            .text('Quantity', this.margin + itemCodeWidth + descriptionWidth, tableTop)
            .text('Unit Price', this.margin + itemCodeWidth + descriptionWidth + quantityWidth, tableTop)
            .text('Total', this.margin + itemCodeWidth + descriptionWidth + quantityWidth + unitPriceWidth, tableTop);

        // Header line
        this.doc.moveTo(this.margin, tableTop + 15)
            .lineTo(this.pageWidth - this.margin, tableTop + 15)
            .stroke();

        this.currentY = tableTop + 25;

        // Table rows
        invoiceData.items.forEach((item, index) => {
            const rowY = this.currentY + (index * 20);

            this.doc.fontSize(9)
                .font('Helvetica')
                .text(item.code, this.margin, rowY)
                .text(item.description, this.margin + itemCodeWidth, rowY)
                .text(item.quantity.toString(), this.margin + itemCodeWidth + descriptionWidth, rowY)
                .text(this.formatCurrency(item.unitPrice), this.margin + itemCodeWidth + descriptionWidth + quantityWidth, rowY)
                .text(this.formatCurrency(item.quantity * item.unitPrice), this.margin + itemCodeWidth + descriptionWidth + quantityWidth + unitPriceWidth, rowY);
        });

        // Bottom line
        const tableBottom = this.currentY + (invoiceData.items.length * 20) + 10;
        this.doc.moveTo(this.margin, tableBottom)
            .lineTo(this.pageWidth - this.margin, tableBottom)
            .stroke();

        this.currentY = tableBottom + 20;
    }

    addTotals(invoiceData) {
        const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const tax = subtotal * (invoiceData.taxRate / 100);
        const total = subtotal + tax;

        const totalsX = this.pageWidth - this.margin - 200;
        const lineHeight = 20;

        this.doc.fontSize(10)
            .font('Helvetica')
            .text('Subtotal:', totalsX, this.currentY)
            .text(this.formatCurrency(subtotal), totalsX + 100, this.currentY);

        this.currentY += lineHeight;

        this.doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX, this.currentY)
            .text(this.formatCurrency(tax), totalsX + 100, this.currentY);

        this.currentY += lineHeight;

        // Total line
        this.doc.fontSize(12)
            .font('Helvetica-Bold')
            .text('Total:', totalsX, this.currentY)
            .text(this.formatCurrency(total), totalsX + 100, this.currentY);

        // Total line underline
        this.doc.moveTo(totalsX, this.currentY + 15)
            .lineTo(totalsX + 150, this.currentY + 15)
            .stroke();

        this.currentY += 40;
    }

    addFooter(invoiceData) {
        // Payment instructions
        this.doc.fontSize(10)
            .font('Helvetica-Bold')
            .text('Payment Instructions:', this.margin, this.currentY);

        this.currentY += 15;

        this.doc.fontSize(9)
            .font('Helvetica')
            .text('Please make checks payable to:', this.margin, this.currentY)
            .text(invoiceData.company.name, this.margin, this.currentY + 15)
            .text('Bank: ' + invoiceData.paymentInfo.bank, this.margin, this.currentY + 30)
            .text('Account: ' + invoiceData.paymentInfo.account, this.margin, this.currentY + 45)
            .text('Routing: ' + invoiceData.paymentInfo.routing, this.margin, this.currentY + 60);

        // Thank you message
        this.doc.fontSize(10)
            .font('Helvetica-Bold')
            .text('Thank you for your business!', this.margin, this.currentY + 100);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}

// Example usage
function generateSampleInvoice() {
    const invoiceData = {
        invoiceNumber: 'INV-2024-001',
        date: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        paymentTerms: 'Net 30',
        taxRate: 8.5,
        company: {
            name: 'TechCorp Solutions',
            address: {
                street: '123 Business Ave',
                city: 'San Francisco',
                state: 'CA',
                zip: '94105'
            },
            phone: '(555) 123-4567',
            email: 'billing@techcorp.com'
        },
        client: {
            name: 'Acme Corporation',
            address: {
                street: '456 Corporate Blvd',
                city: 'New York',
                state: 'NY',
                zip: '10001'
            },
            email: 'accounts@acme.com'
        },
        items: [
            {
                code: 'DEV-001',
                description: 'Web Application Development',
                quantity: 40,
                unitPrice: 150.00
            },
            {
                code: 'DES-002',
                description: 'UI/UX Design Services',
                quantity: 20,
                unitPrice: 125.00
            },
            {
                code: 'CON-003',
                description: 'Consulting Services',
                quantity: 10,
                unitPrice: 200.00
            }
        ],
        paymentInfo: {
            bank: 'First National Bank',
            account: '1234567890',
            routing: '021000021'
        }
    };

    const generator = new InvoiceGenerator();
    const outputPath = generator.generateInvoice(invoiceData, 'sample_invoice.pdf');
    
    console.log(`Invoice generated successfully: ${outputPath}`);
    return outputPath;
}

// Export for use in other modules
module.exports = {
    InvoiceGenerator,
    generateSampleInvoice
};

// Run example if this file is executed directly
if (require.main === module) {
    generateSampleInvoice();
}
