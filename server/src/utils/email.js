import nodemailer from "nodemailer";

export async function sendOrderEmail(toEmail, order) {
    console.log("TRYING TO SEND EMAIL TO:", toEmail);  // 👈

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: toEmail,
            subject: "Your Order Confirmation – Pasovit Store",
            html: "Order placed!"
        });

        console.log("EMAIL SENT SUCCESSFULLY!");
        console.log("PREVIEW URL:", nodemailer.getTestMessageUrl(info)); // 👈

    } catch (err) {
        console.error("EMAIL SEND FAILED:", err); // 👈
    }
}
