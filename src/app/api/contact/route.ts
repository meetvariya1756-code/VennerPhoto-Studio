import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Re-declare schema for server-side validation checks
import * as zod from 'zod';

const contactServerSchema = zod.object({
  name: zod.string().min(2),
  email: zod.string().email(),
  phone: zod.string().min(6),
  service: zod.string().min(1),
  date: zod.string().min(1),
  location: zod.string().optional(),
  message: zod.string().optional(),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate payload
    const parsed = contactServerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, service, date, location, message } = parsed.data;

    // Sanitize user inputs to prevent XSS / HTML Injection attacks
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeService = escapeHtml(service);
    const safeDate = escapeHtml(date);
    const safeLocation = location ? escapeHtml(location) : '';
    const safeMessage = message ? escapeHtml(message) : '';

    // 1.5. Save inquiry to Supabase database
    try {
      const sb = await createServerSupabaseClient();
      await sb.from('contact_inquiries').insert({
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        service: safeService,
        date: safeDate,
        location: safeLocation || null,
        message: safeMessage,
      });
    } catch (dbErr) {
      console.error('Database insertion failed for contact inquiry:', dbErr);
    }

    // 2. Transmit email via Resend if API key is provided
    const resendApiKey = process.env.RESEND_API_KEY;
    const studioEmail = process.env.STUDIO_EMAIL || 'vennerphotostudio@example.com';

    if (resendApiKey && resendApiKey !== 'mock_resend_api_key' && resendApiKey !== 'your_resend_api_key') {
      const resend = new Resend(resendApiKey);

      const emailResult = await resend.emails.send({
        from: 'Venner Studio Contact Form <onboarding@resend.dev>', // Resend verified domain required for custom domains
        to: studioEmail,
        subject: `New Client Booking Inquiry: ${safeName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee;">
            <h2 style="color: #1A1A1A; border-bottom: 2px solid #C9A86C; padding-bottom: 10px;">New Booking Inquiry</h2>
            <p><strong>Client Name:</strong> ${safeName}</p>
            <p><strong>Email Address:</strong> ${safeEmail}</p>
            <p><strong>Phone Number:</strong> ${safePhone}</p>
            <p><strong>Photography Service:</strong> ${safeService}</p>
            <p><strong>Event / Session Date:</strong> ${safeDate}</p>
            <p><strong>Location:</strong> ${safeLocation || 'Not Specified'}</p>
            <p style="margin-top: 20px;"><strong>Client Message:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #C9A86C; font-style: italic;">
              ${safeMessage.replace(/\n/g, '<br />')}
            </div>
            <p style="color: #a0a0a0; font-size: 11px; margin-top: 30px;">
              This notification was generated automatically by the contact form on vennerphotostudio.com.
            </p>
          </div>
        `,
      });

      if (emailResult.error) {
        return NextResponse.json(
          { error: 'Email dispatch failed via Resend nodes', details: emailResult.error },
          { status: 500 }
        );
      }
    } else {
      // High-fidelity fallback console log in development environment when no Resend key is connected
      console.log('--- [MOCK TRANSMISSION] Contact Form Submitted ---');
      console.log('Client Name:', safeName);
      console.log('Client Email:', safeEmail);
      console.log('Client Phone:', safePhone);
      console.log('Service Category:', safeService);
      console.log('Event Date:', safeDate);
      console.log('Event Location:', safeLocation || 'Not Specified');
      console.log('Message Detail:', safeMessage);
      console.log('--- [MOCK TRANSMISSION COMPLETE] ---');
    }

    // 3. Send automated WhatsApp notification to admin via Twilio (if credentials configured)
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER || 'whatsapp:+14155238886'; // Default Twilio sandbox number
    const adminWaNumber = process.env.ADMIN_WHATSAPP_NUMBER || 'whatsapp:+919825983437';

    if (twilioSid && twilioAuthToken) {
      try {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
        const body = new URLSearchParams();
        body.append('To', adminWaNumber);
        body.append('From', twilioFrom);
        body.append('Body', `🔔 *New Booking Inquiry Received!*\n\n• *Client:* ${safeName}\n• *Service:* ${safeService.replace(/-/g, ' ').toUpperCase()}\n• *Phone:* ${safePhone}\n\nA new client query has arrived! Check your Admin Dashboard for details.`);

        await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body.toString()
        });
      } catch (waErr) {
        console.error('Failed to send backend WhatsApp notification via Twilio:', waErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Inquiry processed successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
