import nodemailer from "nodemailer";

const Transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration (optional, but useful for debugging)
Transporter.verify((error) => {
  if (error) {
    console.error("Error with email transporter:", error);
  }
});

export default Transporter;
