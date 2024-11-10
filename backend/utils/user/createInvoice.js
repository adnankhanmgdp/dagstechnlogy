const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const createInvoice = (order , user) => {
    const doc = new PDFDocument();
    const invoicePath = path.join(__dirname, `invoices/invoice_${order.orderId}.pdf`);

    // Pipe PDF into a file
    doc.pipe(fs.createWriteStream(invoicePath));

    // Title and Basic Info
    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.fontSize(16).text(`Order ID: ${order.orderId}`, { align: 'left' });
    doc.text(`Date: ${new Date(order.orderStatus[order.orderStatus.length - 1].time).toISOString().split('T')[0]}`, { align: 'left' });

    // Customer Details
    doc.text(`\nCustomer: ${order.userId}`, { align: 'left' });
    doc.text(`Address: ${order.orderLocation || 'User Address'}`, { align: 'left' });

    // Item Details
    doc.text('\nItems:', { underline: true });
    order.items.forEach(item => {
        doc.text(`${item.qty} x ${item.serviceNAME} - ${item.itemNAME}`, { indent: 20 });
        doc.text(`Price: ₹${item.unitPrice}`, { indent: 40 });
    });

    // Invoice Summary
    doc.text(`\nItems Total: ₹${order.amount}`, { align: 'left' });
    doc.text(`Discount: ₹${order.discount}`, { align: 'left' });
    doc.text(`Tax: ₹${order.taxes}`, { align: 'left' });
    doc.text(`Shipping Fee: ₹${order.deliveryFee}`, { align: 'left' });
    doc.text(`Platform Fee: ₹${order.platformFee}`, { align: 'left' });
    doc.text(`Grand Total: ₹${order.finalAmount}`, { align: 'left' });

    // Footer Notice
    doc.text('\nThank you for your purchase!', { align: 'center' });

    // Finalize the PDF and end the stream
    doc.end();

    return invoicePath;
};

// Example usage
const exampleOrder = {
    orderId: 'OD00001',
    amount: 5000,
    discount: 500,
    taxes: 450,
    platformFee: 200,
    finalAmount: 5150,
    orderStatus: [{ time: new Date() }],
    items: [
        { qty: 2, serviceNAME: 'Service A', itemNAME: 'Item A', unitPrice: 2000 },
        { qty: 1, serviceNAME: 'Service B', itemNAME: 'Item B', unitPrice: 1000 }
    ],
    userId: 'user123',
    orderLocation: '123 Street, City'
};

const invoicePath = createInvoice(exampleOrder);
console.log(`Invoice created at: ${invoicePath}`);
