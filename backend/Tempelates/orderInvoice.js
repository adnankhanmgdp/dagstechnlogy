const orderInvoice = (username, invoiceUrl) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Order Delivered Successfully</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="https://yourcompany.com"><img class="logo" src="https://yourcompany.com/assets/logo.png" alt="Logo"></a>
            <div class="message">Your Order Has Been Delivered!</div>
            <div class="body">
                <p>Dear ${username},</p>
                <p>We are pleased to inform you that your order has been successfully delivered.</p>
                <p>Please find the invoice for your order at the link below:</p>
                <a class="cta" href="${invoiceUrl}" target="_blank">View Invoice</a>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>. We are here to help!</div>
        </div>
    </body>
    </html>`;
};

module.exports = orderInvoice;
