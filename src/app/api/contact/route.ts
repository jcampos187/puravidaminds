import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, buildRateLimitHeaders } from "@/lib/rate-limiter";

// 5 contact form submissions per minute per IP — sensitive to spam
const RATE_LIMIT_CONFIG = { maxRequests: 5, windowMs: 60_000 };

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(`contact:${ip}`, RATE_LIMIT_CONFIG);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many messages. Please wait before trying again." },
        { status: 429, headers: buildRateLimitHeaders(rateLimit, RATE_LIMIT_CONFIG.maxRequests) }
      );
    }
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured — contact form disabled");
      return NextResponse.json(
        { error: "Contact form is not configured yet. Please email us directly at puravidaminds@gmail.com" },
        { status: 503 }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "Contacto Pura Vida Minds <onboarding@resend.dev>",
      to: "kayfas12@gmail.com",    // Temporary — update to puravidaminds@gmail.com once a domain is verified on Resend
      replyTo: email,
      subject: subject
        ? `[Pura Vida Minds] ${subject}`
        : `[Pura Vida Minds] Nuevo mensaje de ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8E7; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #CC2936, #FF7F00, #FFD700); padding: 24px; text-align: center;">
            <h1 style="color: #1A1A2E; margin: 0; font-size: 24px;">📬 Nuevo mensaje de contacto</h1>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #CC2936; width: 100px;">Nombre:</td>
                <td style="padding: 8px 0; color: #1A1A2E;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #CC2936;">Email:</td>
                <td style="padding: 8px 0; color: #1A1A2E;"><a href="mailto:${email}" style="color: #005ABB;">${email}</a></td>
              </tr>
              ${subject ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #CC2936;">Asunto:</td><td style="padding: 8px 0; color: #1A1A2E;">${subject}</td></tr>` : ""}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #CC2936;">
              <p style="margin: 0; color: #1A1A2E; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="background: #1A1A2E; padding: 16px; text-align: center;">
            <p style="margin: 0; color: #FFF8E7; font-size: 12px;">Pura Vida Artesanías · puravidaminds.vercel.app</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
