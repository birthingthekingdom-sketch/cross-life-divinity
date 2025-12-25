/**
 * Payment Renewal Reminder Email Template
 * Sent 3 days before payment due date for payment plans
 */

export function generatePaymentReminderEmail(
  studentName: string,
  planType: string,
  dueDate: Date,
  amount: number,
  paymentNumber: number,
  totalPayments: number
): { subject: string; html: string } {
  
  const formattedDueDate = dueDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const planName = planType === 'LEARNING_PATH' ? 'Learning Path' :
                   planType === 'BUNDLE_3_COURSE' ? '3-Course Bundle' :
                   'Chaplaincy Training Program';

  const subject = `Reminder: Your ${planName} Payment Due on ${formattedDueDate}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .payment-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin: 20px 0; }
          .payment-details { background-color: #f0f4ff; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #1e3a8a; }
          .detail-value { text-align: right; }
          .cta-button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
          .cta-button:hover { background-color: #1e3a8a; }
          .section { margin-bottom: 20px; }
          .section h2 { color: #1e3a8a; font-size: 18px; margin-top: 0; }
          .footer { background-color: #f0f4ff; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 4px; margin-top: 20px; }
          .highlight { color: #f59e0b; font-weight: 600; }
          .success-text { color: #059669; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Reminder</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Your next payment is due soon</p>
          </div>

          <div class="content">
            <p>Hello <span class="highlight">${studentName}</span>,</p>

            <p>This is a friendly reminder that your next payment for the <span class="highlight">${planName}</span> is due on <span class="highlight">${formattedDueDate}</span>.</p>

            <div class="payment-box">
              <p style="margin: 0; font-size: 14px; color: #92400e;">⏰ <strong>Payment Due:</strong> ${formattedDueDate}</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #92400e;">💳 <strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
            </div>

            <div class="payment-details">
              <div class="detail-row">
                <span class="detail-label">Payment Plan:</span>
                <span class="detail-value">${planName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Number:</span>
                <span class="detail-value">${paymentNumber} of ${totalPayments}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Amount Due:</span>
                <span class="detail-value"><strong>$${(amount / 100).toFixed(2)}</strong></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Due Date:</span>
                <span class="detail-value"><strong>${formattedDueDate}</strong></span>
              </div>
            </div>

            <div class="section">
              <h2>What Happens Next?</h2>
              <p>Your payment will be automatically charged on the due date using the payment method on file. No action is required unless you need to update your payment information.</p>
              <p><span class="success-text">✓ Your courses remain active</span> - You'll continue to have full access to all your enrolled courses throughout your payment plan.</p>
            </div>

            <div class="section" style="background-color: #f0f4ff; padding: 20px; border-radius: 6px; text-align: center;">
              <p style="margin-top: 0; color: #1e3a8a; font-weight: 600;">Need to update your payment method?</p>
              <a href="https://crosslifeschoolofdivinity.org/my-payments" class="cta-button">Manage Payment Method</a>
            </div>

            <div class="section">
              <h2>Questions?</h2>
              <p>If you have any questions about your payment or need to make changes to your payment plan, please contact our support team:</p>
              <p><strong>Email:</strong> <a href="mailto:support@crosslifeschoolofdivinity.org" style="color: #3b82f6; text-decoration: none;">support@crosslifeschoolofdivinity.org</a></p>
              <p><strong>Response Time:</strong> We typically respond within 24 hours</p>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">Thank you for your commitment to your theological education and ministry growth. We're honored to be part of your journey.</p>

            <p style="color: #1e3a8a; font-weight: 600;">Blessings,<br>The Cross Life School of Divinity Team</p>
          </div>

          <div class="footer">
            <p style="margin: 0;">© 2025 Cross Life School of Divinity. All rights reserved.</p>
            <p style="margin: 8px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}
