const verifyingDetails = (username ) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Details Submitted</title>
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
                background-color: #FFD60A;
                color: #000000;
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
            .highlight {
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="https://dagstechnology.in"><img class="logo" src="https://admin.dagstechnology.in/assets/Dags.jpg" alt="Logo"></a>
            <div class="message">Thank You for Your Submission!</div>
            <div class="body">
                <p>Dear ${username},</p>
                <p>Your details have been successfully submitted.</p>
                <p>Our team is currently verifying the information provided.</p>
                <p>Please wait patiently while we complete the verification process.</p>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:contact@dagstechnology.in">contact@dagstechnology.in</a>. We are here to help!</div>
        </div>
    </body>
    </html>`;
};

module.exports = verifyingDetails;
