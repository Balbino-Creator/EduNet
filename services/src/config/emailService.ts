import nodemailer from "nodemailer";

export const sendConfirmationEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

    const confirmationLink = `${process.env.BACKEND_URL}confirm?token=${token}`

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Account Confirmation",
        text: `Please confirm your account by clicking the following link: ${confirmationLink}`,
        html: `<p>Please confirm your account by clicking the link below:</p>
               <a href="${confirmationLink}">Confirm Account</a>`
    };

    await transporter.sendMail(mailOptions)
};
