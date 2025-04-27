import ejs from "ejs";
import Transporter from "./transporter";
import otpTemplate from "../email/templates/otp.ejs";
import messageTemplate from "../email/templates/message.ejs";

// Render template function
async function renderTemplate(templateName: string, data: object) {
  const templates: { [key: string]: string } = {
    otp: otpTemplate,
    message: messageTemplate,
  };
  const template = templates[templateName];
  if (!template) throw new Error(`Template ${templateName} not found`);
  return ejs.render(template, data);
}

export async function sendOtp(email: string, otp: string) {
  try {
    if (!email || !otp) {
      throw new Error("Email and OTP are required");
    }
    const html = await renderTemplate("otp", { otp });
    await Transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html,
    });
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
}

export async function sendEmail(email: string, message: string) {
  try {
    if (!email || !message) {
      throw new Error("Email and message are required");
    }
    const html = await renderTemplate("message", { message });
    await Transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Message",
      html,
    });
    return true;
  } catch (error) {
    console.error("Error sending message email:", error);
    return false;
  }
}
