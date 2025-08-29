const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { InvoiceGenerator } = require('./pdf-invoice-generator');
const { EmailTemplateSystem } = require('./email-template-system');

class DocumentWorkflowAutomation {
    constructor(config = {}) {
        this.config = {
            storageDir: config.storageDir || './generated_documents',
            templatesDir: config.templatesDir || './templates',
            maxConcurrentJobs: config.maxConcurrentJobs || 5,
            retryAttempts: config.retryAttempts || 3,
            ...config
        };

        this.jobQueue = [];
        this.activeJobs = new Map();
        this.jobHistory = new Map();
        this.ensureDirectories();
        this.initializeGenerators();
    }

    async ensureDirectories() {
        const dirs = [this.config.storageDir, this.config.templatesDir];
        for (const dir of dirs) {
            try {
                await fs.mkdir(dir, { recursive: true });
            } catch (error) {
                console.warn(`Directory creation failed for ${dir}:`, error.message);
            }
        }
    }

    initializeGenerators() {
        this.invoiceGenerator = new InvoiceGenerator();
        this.emailSystem = new EmailTemplateSystem({
            templatesDir: this.config.templatesDir
        });
    }

    // Job Management
    async addJob(jobData) {
        const job = {
            id: this.generateJobId(),
            status: 'pending',
            type: jobData.type,
            data: jobData.data,
            priority: jobData.priority || 'normal',
            created_at: new Date(),
            attempts: 0,
            result: null,
            error: null
        };

        this.jobQueue.push(job);
        this.jobHistory.set(job.id, job);
        
        console.log(`Job ${job.id} added to queue: ${job.type}`);
        this.processQueue();
        
        return job.id;
    }

    async processQueue() {
        if (this.activeJobs.size >= this.config.maxConcurrentJobs) {
            return;
        }

        const pendingJobs = this.jobQueue.filter(job => job.status === 'pending');
        if (pendingJobs.length === 0) {
            return;
        }

        // Sort by priority
        pendingJobs.sort((a, b) => {
            const priorityOrder = { high: 3, normal: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        const job = pendingJobs[0];
        this.jobQueue = this.jobQueue.filter(j => j.id !== job.id);
        
        await this.processJob(job);
    }

    async processJob(job) {
        this.activeJobs.set(job.id, job);
        job.status = 'processing';
        job.started_at = new Date();

        try {
            console.log(`Processing job ${job.id}: ${job.type}`);

            const result = await this.executeWorkflow(job);
            
            job.status = 'completed';
            job.completed_at = new Date();
            job.result = result;

            console.log(`Job ${job.id} completed successfully`);

        } catch (error) {
            job.attempts++;
            job.error = error.message;

            if (job.attempts < this.config.retryAttempts) {
                job.status = 'pending';
                job.error = null;
                this.jobQueue.push(job);
                console.log(`Job ${job.id} will be retried (attempt ${job.attempts}/${this.config.retryAttempts})`);
            } else {
                job.status = 'failed';
                job.completed_at = new Date();
                console.error(`Job ${job.id} failed after ${job.attempts} attempts:`, error.message);
            }
        } finally {
            this.activeJobs.delete(job.id);
            this.processQueue(); // Process next job
        }
    }

    async executeWorkflow(job) {
        const workflows = {
            'invoice': this.processInvoiceWorkflow.bind(this),
            'contract': this.processContractWorkflow.bind(this),
            'report': this.processReportWorkflow.bind(this),
            'email_campaign': this.processEmailCampaignWorkflow.bind(this),
            'document_batch': this.processDocumentBatchWorkflow.bind(this)
        };

        const workflow = workflows[job.type];
        if (!workflow) {
            throw new Error(`Unknown workflow type: ${job.type}`);
        }

        return await workflow(job.data);
    }

    // Workflow Implementations
    async processInvoiceWorkflow(data) {
        const result = {
            documents: [],
            emails: [],
            metadata: {}
        };

        // Generate invoice PDF
        const invoicePath = await this.invoiceGenerator.generateInvoice(
            data.invoice,
            path.join(this.config.storageDir, `invoice_${data.invoice.invoiceNumber}.pdf`)
        );
        result.documents.push({
            type: 'invoice',
            path: invoicePath,
            filename: path.basename(invoicePath)
        });

        // Send email if required
        if (data.sendEmail) {
            const emailResult = await this.emailSystem.sendEmail('invoice-notification', {
                ...data.invoice,
                recipient_email: data.customer.email,
                subject: `Invoice #${data.invoice.invoiceNumber} - ${data.invoice.company.name}`,
                invoice_path: invoicePath
            });
            result.emails.push(emailResult);
        }

        // Store metadata
        result.metadata = {
            invoice_number: data.invoice.invoiceNumber,
            customer: data.customer.name,
            amount: data.invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
            generated_at: new Date().toISOString()
        };

        return result;
    }

    async processContractWorkflow(data) {
        const result = {
            documents: [],
            notifications: [],
            metadata: {}
        };

        // Generate contract document
        const contractPath = path.join(this.config.storageDir, `contract_${data.contract.id}.docx`);
        
        // This would integrate with the Word document generator
        // For now, we'll create a placeholder
        await fs.writeFile(contractPath, 'Contract document content');
        
        result.documents.push({
            type: 'contract',
            path: contractPath,
            filename: path.basename(contractPath)
        });

        // Send notifications
        if (data.notifications) {
            for (const notification of data.notifications) {
                const emailResult = await this.emailSystem.sendEmail('contract-notification', {
                    recipient_email: notification.email,
                    subject: `Contract ${data.contract.id} - ${notification.type}`,
                    contract: data.contract,
                    notification_type: notification.type
                });
                result.notifications.push(emailResult);
            }
        }

        result.metadata = {
            contract_id: data.contract.id,
            client: data.contract.client_name,
            project: data.contract.project_name,
            generated_at: new Date().toISOString()
        };

        return result;
    }

    async processReportWorkflow(data) {
        const result = {
            documents: [],
            metadata: {}
        };

        // Generate report
        const reportPath = path.join(this.config.storageDir, `report_${data.report.id}.pdf`);
        
        // This would integrate with a report generator
        await fs.writeFile(reportPath, 'Report content');
        
        result.documents.push({
            type: 'report',
            path: reportPath,
            filename: path.basename(reportPath)
        });

        result.metadata = {
            report_id: data.report.id,
            report_type: data.report.type,
            generated_at: new Date().toISOString()
        };

        return result;
    }

    async processEmailCampaignWorkflow(data) {
        const result = {
            emails_sent: 0,
            emails_failed: 0,
            errors: [],
            metadata: {}
        };

        const recipients = data.recipients || [];
        
        for (const recipient of recipients) {
            try {
                const emailData = {
                    ...data.template_data,
                    recipient_email: recipient.email,
                    customer_name: recipient.name,
                    user_id: recipient.id
                };

                if (data.abTest) {
                    await this.emailSystem.sendABTestEmail(
                        data.template_name,
                        emailData,
                        data.abTest
                    );
                } else {
                    await this.emailSystem.sendEmail(data.template_name, emailData);
                }

                result.emails_sent++;
            } catch (error) {
                result.emails_failed++;
                result.errors.push({
                    recipient: recipient.email,
                    error: error.message
                });
            }
        }

        result.metadata = {
            campaign_id: data.campaign_id,
            template: data.template_name,
            total_recipients: recipients.length,
            completed_at: new Date().toISOString()
        };

        return result;
    }

    async processDocumentBatchWorkflow(data) {
        const result = {
            documents: [],
            summary: {
                total: data.documents.length,
                successful: 0,
                failed: 0
            },
            errors: []
        };

        for (const docData of data.documents) {
            try {
                const docResult = await this.executeWorkflow({
                    type: docData.type,
                    data: docData.data
                });

                result.documents.push({
                    id: docData.id,
                    type: docData.type,
                    result: docResult
                });

                result.summary.successful++;
            } catch (error) {
                result.summary.failed++;
                result.errors.push({
                    id: docData.id,
                    type: docData.type,
                    error: error.message
                });
            }
        }

        return result;
    }

    // Job Status and Management
    getJobStatus(jobId) {
        const job = this.jobHistory.get(jobId);
        if (!job) {
            return null;
        }

        return {
            id: job.id,
            status: job.status,
            type: job.type,
            priority: job.priority,
            created_at: job.created_at,
            started_at: job.started_at,
            completed_at: job.completed_at,
            attempts: job.attempts,
            result: job.result,
            error: job.error
        };
    }

    getQueueStatus() {
        return {
            pending: this.jobQueue.filter(job => job.status === 'pending').length,
            processing: this.activeJobs.size,
            completed: Array.from(this.jobHistory.values()).filter(job => job.status === 'completed').length,
            failed: Array.from(this.jobHistory.values()).filter(job => job.status === 'failed').length,
            total: this.jobHistory.size
        };
    }

    cancelJob(jobId) {
        const job = this.jobQueue.find(j => j.id === jobId);
        if (job && job.status === 'pending') {
            this.jobQueue = this.jobQueue.filter(j => j.id !== jobId);
            job.status = 'cancelled';
            return true;
        }
        return false;
    }

    generateJobId() {
        return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Database Integration (Simulated)
    async saveToDatabase(jobId, result) {
        // Simulate database save
        const dbRecord = {
            job_id: jobId,
            result: result,
            created_at: new Date(),
            status: 'completed'
        };

        console.log(`Saving to database: ${jobId}`);
        return dbRecord;
    }

    async loadFromDatabase(jobId) {
        // Simulate database load
        const job = this.jobHistory.get(jobId);
        return job ? { ...job } : null;
    }
}

// Express.js API Integration
class DocumentWorkflowAPI {
    constructor(workflowAutomation) {
        this.workflow = workflowAutomation;
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });

        // Submit job
        this.app.post('/api/jobs', async (req, res) => {
            try {
                const { type, data, priority } = req.body;
                
                if (!type || !data) {
                    return res.status(400).json({ error: 'Missing required fields: type and data' });
                }

                const jobId = await this.workflow.addJob({ type, data, priority });
                res.json({ job_id: jobId, status: 'submitted' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Get job status
        this.app.get('/api/jobs/:jobId', (req, res) => {
            const jobId = req.params.jobId;
            const status = this.workflow.getJobStatus(jobId);
            
            if (!status) {
                return res.status(404).json({ error: 'Job not found' });
            }
            
            res.json(status);
        });

        // Get queue status
        this.app.get('/api/queue/status', (req, res) => {
            const status = this.workflow.getQueueStatus();
            res.json(status);
        });

        // Cancel job
        this.app.delete('/api/jobs/:jobId', (req, res) => {
            const jobId = req.params.jobId;
            const cancelled = this.workflow.cancelJob(jobId);
            
            if (cancelled) {
                res.json({ message: 'Job cancelled successfully' });
            } else {
                res.status(404).json({ error: 'Job not found or cannot be cancelled' });
            }
        });

        // Generate document directly
        this.app.post('/api/documents/generate', async (req, res) => {
            try {
                const { type, data, format } = req.body;
                
                if (!type || !data) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const result = await this.workflow.executeWorkflow({ type, data });
                
                if (format === 'download') {
                    // Return file for download
                    const document = result.documents[0];
                    if (document) {
                        res.download(document.path, document.filename);
                    } else {
                        res.status(404).json({ error: 'No document generated' });
                    }
                } else {
                    // Return JSON response
                    res.json({ 
                        success: true, 
                        result: result,
                        document_url: result.documents[0]?.path || null
                    });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    start(port = 3001) {
        return new Promise((resolve) => {
            this.server = this.app.listen(port, () => {
                console.log(`Document Workflow API running on port ${port}`);
                resolve();
            });
        });
    }

    stop() {
        if (this.server) {
            this.server.close();
        }
    }
}

// Example usage
async function runWorkflowExamples() {
    console.log('Starting Document Workflow Automation Examples...');

    // Initialize workflow automation
    const workflow = new DocumentWorkflowAutomation({
        storageDir: './generated_documents',
        maxConcurrentJobs: 3
    });

    // Initialize API
    const api = new DocumentWorkflowAPI(workflow);
    await api.start(3001);

    // Example 1: Invoice workflow
    const invoiceJob = await workflow.addJob({
        type: 'invoice',
        data: {
            invoice: {
                invoiceNumber: 'INV-2024-001',
                company: {
                    name: 'TechCorp Solutions',
                    address: { street: '123 Business Ave', city: 'San Francisco', state: 'CA', zip: '94105' },
                    phone: '(555) 123-4567',
                    email: 'billing@techcorp.com'
                },
                client: {
                    name: 'Acme Corporation',
                    address: { street: '456 Corporate Blvd', city: 'New York', state: 'NY', zip: '10001' },
                    email: 'accounts@acme.com'
                },
                items: [
                    { code: 'DEV-001', description: 'Web Development', quantity: 40, unitPrice: 150.00 },
                    { code: 'DES-002', description: 'UI/UX Design', quantity: 20, unitPrice: 125.00 }
                ],
                date: new Date(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                paymentTerms: 'Net 30',
                taxRate: 8.5,
                paymentInfo: {
                    bank: 'First National Bank',
                    account: '1234567890',
                    routing: '021000021'
                }
            },
            customer: {
                name: 'Acme Corporation',
                email: 'accounts@acme.com'
            },
            sendEmail: true
        },
        priority: 'high'
    });

    // Example 2: Email campaign workflow
    const emailJob = await workflow.addJob({
        type: 'email_campaign',
        data: {
            campaign_id: 'campaign_001',
            template_name: 'promotional',
            template_data: {
                subject: 'Special Offer Just for You!',
                promo_code: 'SAVE20',
                expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                cta_url: 'https://techcorp.com/shop'
            },
            recipients: [
                { id: 'user_1', name: 'John Doe', email: 'john@example.com' },
                { id: 'user_2', name: 'Jane Smith', email: 'jane@example.com' },
                { id: 'user_3', name: 'Bob Johnson', email: 'bob@example.com' }
            ],
            abTest: {
                testId: 'promo_2024_q1',
                variants: ['A', 'B']
            }
        },
        priority: 'normal'
    });

    // Example 3: Document batch workflow
    const batchJob = await workflow.addJob({
        type: 'document_batch',
        data: {
            documents: [
                {
                    id: 'doc_1',
                    type: 'invoice',
                    data: {
                        invoice: {
                            invoiceNumber: 'INV-2024-002',
                            company: { name: 'TechCorp Solutions' },
                            client: { name: 'Client A' },
                            items: [{ code: 'SVC-001', description: 'Consulting', quantity: 10, unitPrice: 200.00 }],
                            date: new Date(),
                            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            paymentTerms: 'Net 30',
                            taxRate: 8.5,
                            paymentInfo: { bank: 'Bank A', account: '123', routing: '456' }
                        },
                        customer: { name: 'Client A', email: 'clienta@example.com' },
                        sendEmail: false
                    }
                },
                {
                    id: 'doc_2',
                    type: 'report',
                    data: {
                        report: {
                            id: 'report_001',
                            type: 'monthly',
                            title: 'Monthly Sales Report',
                            summary: 'Sales performance for the current month'
                        }
                    }
                }
            ]
        },
        priority: 'low'
    });

    console.log('Jobs submitted:');
    console.log(`- Invoice job: ${invoiceJob}`);
    console.log(`- Email campaign job: ${emailJob}`);
    console.log(`- Document batch job: ${batchJob}`);

    // Monitor jobs
    const monitorJobs = async () => {
        const jobs = [invoiceJob, emailJob, batchJob];
        
        for (const jobId of jobs) {
            const status = workflow.getJobStatus(jobId);
            console.log(`Job ${jobId}: ${status?.status}`);
        }

        const queueStatus = workflow.getQueueStatus();
        console.log('Queue status:', queueStatus);
    };

    // Monitor for 30 seconds
    const interval = setInterval(monitorJobs, 5000);
    setTimeout(() => {
        clearInterval(interval);
        console.log('Monitoring completed');
        api.stop();
    }, 30000);
}

// Export for use in other modules
module.exports = {
    DocumentWorkflowAutomation,
    DocumentWorkflowAPI,
    runWorkflowExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
    runWorkflowExamples().catch(console.error);
}
