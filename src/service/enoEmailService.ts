import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


export const sendEmail = async (to: string, subject: string , name?: string) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">Hola ${name ?? to},</h2>
      <p>🎉 <strong>¡Bienvenido a <span style="color: #007bff;">Mi App</span>!</strong></p>
      <p>Esperamos que disfrutes tu experiencia y encuentres lo que necesitas.</p>
      <p>Si tienes alguna duda o sugerencia, no dudes en contactarnos.</p>
      <br />
      <p>Gracias por registrarte,</p>
      <p>— El equipo de <strong>Mi App</strong></p>
    </div>
  `;
  const info = await transporter.sendMail({
    from: `"Mi App" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || "Bienvenido a Mi App",
    html: htmlContent,
  });
  console.log("email enviado", info.messageId);
}