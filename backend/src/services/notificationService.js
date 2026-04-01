const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email transporter
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Twilio SMS client - only initialize if valid credentials
let twilioClient = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio SMS service initialized');
  } else {
    console.log('ℹ️ Twilio SMS not configured (placeholder credentials detected)');
  }
} catch (err) {
  console.log('ℹ️ Twilio SMS initialization skipped:', err.message);
}

// Send registration welcome email
async function sendWelcomeEmail(customer) {
  if (!process.env.EMAIL_USER) {
    console.log('📧 Email not configured. Skipping email notification.');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `Welcome to ${process.env.HOTEL_NAME}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center;">
            <h1>${process.env.HOTEL_NAME}</h1>
            <p>Welcome to our hotel family!</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Hello ${customer.name}! 👋</h2>
            
            <p>Thank you for registering with <strong>${process.env.HOTEL_NAME}</strong>!</p>
            
            <p><strong>Your Account Details:</strong></p>
            <ul style="background: white; padding: 15px; border-left: 4px solid #667eea;">
              <li><strong>Name:</strong> ${customer.name}</li>
              <li><strong>Email:</strong> ${customer.email}</li>
              <li><strong>Phone:</strong> ${customer.phone || 'Not provided'}</li>
            </ul>
            
            <p style="margin-top: 20px;">You can now:</p>
            <ul>
              <li>📅 Book rooms online</li>
              <li>🏋️ Reserve gym facilities</li>
              <li>🏊 Book swimming pool sessions</li>
              <li>🍽️ Order food from our menu</li>
              <li>🍹 Reserve our luxury bar</li>
            </ul>
            
            <div style="background: #667eea; color: white; padding: 15px; border-radius: 5px; text-align: center; margin-top: 20px;">
              <p><strong>Need Help?</strong></p>
              <p>Contact us at ${process.env.HOTEL_SUPPORT_EMAIL}</p>
            </div>
          </div>
          
          <div style="padding: 20px; background: #333; color: white; text-align: center; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} ${process.env.HOTEL_NAME}. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
}

// Send SMS via provider (Twilio, Jazz API, or HTTP Gateway)
async function sendSMS(phone, message) {
  const provider = process.env.SMS_PROVIDER || 'twilio';
  
  // Validate phone number
  let phoneNumber = phone;
  if (!phoneNumber) {
    console.log('📱 No phone number provided');
    return false;
  }
  
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+92' + phoneNumber.replace(/^0/, '');
  }

  try {
    if (provider === 'twilio' && twilioClient) {
      // Twilio SMS
      const msg = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      console.log('✅ SMS sent via Twilio:', msg.sid);
      return true;
    } 
    else if (provider === 'jazz') {
      // Jazz/Mobilink SMS API (Pakistan)
      const fetch = require('node-fetch');
      const response = await fetch(process.env.JAZZ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.JAZZ_API_KEY}`
        },
        body: JSON.stringify({
          to: phoneNumber,
          text: message,
          from: process.env.JAZZ_SENDER_ID || 'RoyalPlaza'
        })
      });
      
      if (response.ok) {
        console.log('✅ SMS sent via Jazz API');
        return true;
      } else {
        console.error('❌ Jazz API error:', response.statusText);
        return false;
      }
    }
    else if (provider === 'http') {
      // Generic HTTP SMS Gateway
      const fetch = require('node-fetch');
      const response = await fetch(process.env.SMS_GATEWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message,
          apikey: process.env.SMS_GATEWAY_APIKEY,
          sender: process.env.SMS_SENDER_ID || 'RoyalPlaza'
        })
      });
      
      if (response.ok) {
        console.log('✅ SMS sent via HTTP Gateway');
        return true;
      } else {
        console.error('❌ Gateway error:', response.statusText);
        return false;
      }
    }
    else {
      console.log('📱 SMS provider not configured');
      return false;
    }
  } catch (error) {
    console.error('❌ SMS error:', error.message);
    return false;
  }
}

// Send registration welcome SMS
async function sendWelcomeSMS(customer) {
  if (!customer.phone) {
    console.log('📱 No phone number provided');
    return false;
  }

  const message = `Welcome to ${process.env.HOTEL_NAME}! Your account created successfully. Thanks for registering! Support: ${process.env.HOTEL_SUPPORT_EMAIL}`;
  return await sendSMS(customer.phone, message);
}

// Send booking confirmation email
async function sendBookingConfirmationEmail(customer, booking) {
  if (!process.env.EMAIL_USER) {
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: `Booking Confirmation - ${process.env.HOTEL_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center;">
            <h1>Booking Confirmed! ✅</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Hello ${customer.name}!</h2>
            
            <p><strong>Your booking has been confirmed:</strong></p>
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea;">
              <p><strong>Booking ID:</strong> ${booking.id}</p>
              <p><strong>Check-in:</strong> ${new Date(booking.check_in_date).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> ${new Date(booking.check_out_date).toLocaleDateString()}</p>
              <p><strong>Room Type:</strong> ${booking.room_type}</p>
              <p><strong>Total Price:</strong> Rs. ${booking.total_price}</p>
            </div>
            
            <p style="margin-top: 20px;">Thank you for choosing ${process.env.HOTEL_NAME}!</p>
          </div>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent');
    return true;
  } catch (error) {
    console.error('❌ Booking email error:', error.message);
    return false;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendWelcomeSMS,
  sendBookingConfirmationEmail
};
