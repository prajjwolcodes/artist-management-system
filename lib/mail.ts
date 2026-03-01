import nodemailer from "nodemailer";

export async function sendActivationEmail(
    email: string,
    activationLink: string
) {
    const transporter = nodemailer.createTransport({
        service: "gmail", // or use SMTP config
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Cloco Music <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Activate Your Account",
        html: `
      <h2>Welcome!</h2>
      <p>You have been invited to join Cloco Music.</p>
      <p>Click below to activate your account:</p>
      <a href="${activationLink}">Activate Account</a>
      <p>This link expires in 24 hours.</p>
    `,
    });
}