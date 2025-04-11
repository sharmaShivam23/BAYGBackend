


const User = require('../model/userSchema');
const sendEmail = require('../Tools/sendEmail');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.contact = async (req, res) => {
  try {
    const { name, email, Phone, message ,recaptchaValue} = req.body;

    if (!name || !email || !Phone || !message) {
      return res.status(400).send({ success: false, message: "All detail are required" });
    }
          
    if (!recaptchaValue) {
      return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
    }


    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const secretKey = process.env.SECRET_KEY;
    const recaptchaResponse = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: recaptchaValue,
      },
    });

    if (!recaptchaResponse.data.success) {
      return res.status(400).send({ success: false, message: "reCAPTCHA verification failed" });
    }

    const userCreate = await User.create({ name, email, Phone, message });

  
    const templatePath = path.join(__dirname, '../Templates/contact.html');
    if (!fs.existsSync(templatePath)) {
      return res.status(500).send({
        success: false,
        message: "contact template not found.",
      });
    }

    const contactTemplate = fs.readFileSync(templatePath, 'utf8');
    const userEmailHtml = contactTemplate.replace("{{ name }}", name);

  
    const userEmailSent = await sendEmail(
      email,
      "Thank you for contacting BAYG!",
      `Hi ${name}, your message has been received. We'll get back to you soon.`,
      userEmailHtml
    );

    if (!userEmailSent) {
      return res.status(500).send({ success: false, message: "Failed to send confirmation email to user." })
    }

    
    const startupEmailBody = `
      <h3>New Contact Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${Phone}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;
    const notifyStartupEmail = await sendEmail(
      process.env.STARTUP_EMAIL, // set this in your .env
      "New Contact Form Submission",
      `New contact form submission from ${name}`,
      startupEmailBody
    );

    if (!notifyStartupEmail) {
      return res.status(500).send({ success: false, message: "Failed to notify startup." });
    }

    
    res.status(201).send({
      success: true,
      data: userCreate,
      message: "Your message has been sent successfully.",
    });

  } catch (error) {
    console.error("Error during contact:", error.message)
    return res.status(500).send({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};
