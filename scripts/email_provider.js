const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

const code = "0000";

// Create a transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: 'htl.syp.group5@gmail.com',
        pass: 'poge fgif itds itis',
    },
    secure: true, // Use secure connection (TLS)
    tls: {
        secureProtocol: "TLSv1_method",
    }
});


// Generate a random 5-digit code
const generateRandomCode = () => Math.floor(10000 + Math.random() * 90000);

// Route to send registration email
app.use(cors());
app.post('/send-register-mail', express.json(), (req, res) => {
    const email = req.body.email;
    const code = generateRandomCode();
    const text = `Your Verification-Code is: ${code}`;

    console.log("Your Email was sent to " + email);

    // Email content
    const mailOptions = {
        from: 'htl.syp.group5@gmail.com',
        to: email,
        subject: 'Register Verification',
        text: text
    };

    // Send email
    console.log("Before sending email");
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        console.log("After sending email");
    });
    
});


// Route to send reset email
app.get('/send-reset-mail/:email', (req, res) => {
    const email = req.params.email;
    code = generateRandomCode();
    const text = `Your Reset-Code is: ${code}`;

    // Email content
    const mailOptions = {
        from: 'htl.syp.group5@gmail.com',
        to: email,
        subject: 'Password Reset Code',
        text: text
    };

    // Send email
    console.log("Before sending email");
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        console.log("After sending email");
    });    
});

// Route to check code
app.get('/check-code/:code', (req, res) => {
    const code1 = req.params.code;
    const result = checkCode(code1);
    res.json({ isValid: result });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Function to check code
function checkCode(code1) {
    if (code === code1) {
        return true;
    }
    return false;
}
