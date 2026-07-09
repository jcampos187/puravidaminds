const ADMIN_EMAIL = "kayfas12@gmail.com";
const FROM_ADDRESS = "Pura Vida Artesanías <onboarding@resend.dev>";

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured — skipping email");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8E7; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #CC2936, #FF7F00, #FFD700); padding: 24px; text-align: center;">
            <h1 style="color: #1A1A2E; margin: 0; font-size: 24px;">Pura Vida Artesanías ✨</h1>
          </div>
          <div style="padding: 24px;">
            ${html}
          </div>
          <div style="background: #1A1A2E; padding: 16px; text-align: center;">
            <p style="margin: 0; color: #FFF8E7; font-size: 12px;">
              Pura Vida Artesanías · 
              <a href="https://puravidaminds.vercel.app" style="color: #FFD700;">
                Visit our site →
              </a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send email:", error);
    }
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

export async function sendNotification(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await sendEmail(to, subject, html);
}

export async function sendAdminNotification(
  subject: string,
  html: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured — skipping notification");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: ADMIN_EMAIL,
      subject: `[Admin] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8E7; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #CC2936, #FF7F00, #FFD700); padding: 24px; text-align: center;">
            <h1 style="color: #1A1A2E; margin: 0; font-size: 24px;">🛡️ Admin Notification</h1>
          </div>
          <div style="padding: 24px;">
            ${html}
          </div>
          <div style="background: #1A1A2E; padding: 16px; text-align: center;">
            <p style="margin: 0; color: #FFF8E7; font-size: 12px;">
              Pura Vida Artesanías · 
              <a href="https://puravidaminds.vercel.app/dashboard/admin" style="color: #FFD700;">
                Go to Admin Dashboard →
              </a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send admin notification:", error);
    }
  } catch (err) {
    console.error("Failed to send admin notification:", err);
  }
}

export async function notifyNewArtisan(
  name: string,
  email: string,
  businessName: string | null,
  location: string | null
): Promise<void> {
  await sendAdminNotification(
    `New Artisan Registration: ${name}`,
    `
      <h2 style="color: #CC2936; margin: 0 0 16px;">🧑‍🎨 New Artisan Registration</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #CC2936; width: 100px;">Name:</td>
          <td style="padding: 8px 0; color: #1A1A2E;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #CC2936;">Email:</td>
          <td style="padding: 8px 0; color: #1A1A2E;">
            <a href="mailto:${email}" style="color: #005ABB;">${email}</a>
          </td>
        </tr>
        ${businessName ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #CC2936;">Business:</td><td style="padding: 8px 0; color: #1A1A2E;">${businessName}</td></tr>` : ""}
        ${location ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #CC2936;">Location:</td><td style="padding: 8px 0; color: #1A1A2E;">${location}</td></tr>` : ""}
      </table>
      <div style="margin-top: 20px; text-align: center;">
        <a href="https://puravidaminds.vercel.app/dashboard/admin/artisans"
           style="display: inline-block; background: #CC2936; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
          Review Artisan →
        </a>
      </div>
    `
  );
}

export async function notifyNewProduct(
  productTitle: string,
  artisanName: string | null,
  price: string | null
): Promise<void> {
  await sendAdminNotification(
    `New Product Pending: ${productTitle}`,
    `
      <h2 style="color: #005ABB; margin: 0 0 16px;">📦 New Product Pending Review</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #CC2936; width: 100px;">Product:</td>
          <td style="padding: 8px 0; color: #1A1A2E; font-weight: bold;">${productTitle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #CC2936;">Artisan:</td>
          <td style="padding: 8px 0; color: #1A1A2E;">${artisanName || "Unknown"}</td>
        </tr>
        ${price ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #CC2936;">Price:</td><td style="padding: 8px 0; color: #1A1A2E;">${price}</td></tr>` : ""}
      </table>
      <div style="margin-top: 20px; text-align: center;">
        <a href="https://puravidaminds.vercel.app/dashboard/admin/products"
           style="display: inline-block; background: #005ABB; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
          Review Product →
        </a>
      </div>
    `
  );
}

export async function notifyArtisanReviewResult(
  userEmail: string,
  userName: string,
  businessName: string | null,
  approved: boolean
): Promise<void> {
  if (approved) {
    await sendNotification(
      userEmail,
      "✅ Your Artisan Application was Approved!",
      `
        <h2 style="color: #16A34A; margin: 0 0 16px;">🎉 Congratulations, ${userName}!</h2>
        <p style="color: #1A1A2E; line-height: 1.6;">
          Your artisan application has been <strong style="color: #16A34A;">approved</strong>!
          ${businessName ? `Your business "<strong>${businessName}</strong>" is now part of the Pura Vida Artesanías community.` : "You are now part of the Pura Vida Artesanías community."}
        </p>
        <p style="color: #1A1A2E; line-height: 1.6;">
          You can now <strong>create and list your products</strong> for customers to discover and purchase.
        </p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://puravidaminds.vercel.app/dashboard/products/new"
             style="display: inline-block; background: #16A34A; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
            Add Your First Product →
          </a>
        </div>
      `
    );
  } else {
    await sendNotification(
      userEmail,
      "ℹ️ Your Artisan Application Status",
      `
        <h2 style="color: #DC2626; margin: 0 0 16px;">Application Update</h2>
        <p style="color: #1A1A2E; line-height: 1.6;">
          Hi ${userName},
        </p>
        <p style="color: #1A1A2E; line-height: 1.6;">
          After careful review, we have decided not to approve your artisan application
          ${businessName ? `for "<strong>${businessName}</strong>"` : ""} at this time.
        </p>
        <p style="color: #1A1A2E; line-height: 1.6;">
          If you have any questions or would like more information, please don't hesitate to
          <a href="https://puravidaminds.vercel.app/#contact" style="color: #005ABB;">contact us</a>.
          We encourage you to refine your application and try again!
        </p>
      `
    );
  }
}

export async function notifyProductReviewResult(
  userEmail: string,
  userName: string,
  productTitle: string,
  approved: boolean
): Promise<void> {
  if (approved) {
    await sendNotification(
      userEmail,
      `✅ "${productTitle}" was Approved!`,
      `
        <h2 style="color: #16A34A; margin: 0 0 16px;">🎉 Product Approved!</h2>
        <p style="color: #1A1A2E; line-height: 1.6;">
          Hi ${userName},
        </p>
        <p style="color: #1A1A2E; line-height: 1.6;">
          Your product <strong style="color: #16A34A;">"${productTitle}"</strong> has been <strong>approved</strong>
          and is now <strong>visible to customers</strong> on the Pura Vida Artesanías marketplace!
        </p>
        <div style="margin-top: 20px; text-align: center;">
          <a href="https://puravidaminds.vercel.app/products"
             style="display: inline-block; background: #16A34A; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
            View Products →
          </a>
        </div>
      `
    );
  } else {
    await sendNotification(
      userEmail,
      `ℹ️ "${productTitle}" was Declined`,
      `
        <h2 style="color: #DC2626; margin: 0 0 16px;">Product Update</h2>
        <p style="color: #1A1A2E; line-height: 1.6;">
          Hi ${userName},
        </p>
        <p style="color: #1A1A2E; line-height: 1.6;">
          After careful review, we have decided not to approve your product
          <strong style="color: #DC2626;">"${productTitle}"</strong> at this time.
        </p>
        <p style="color: #1A1A2E; line-height: 1.6;">
          If you have any questions or would like more information, please
          <a href="https://puravidaminds.vercel.app/#contact" style="color: #005ABB;">contact us</a>.
          We encourage you to make adjustments and resubmit your product!
        </p>
      `
    );
  }
}
