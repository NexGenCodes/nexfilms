// This is a placeholder for email functionality
// In a real application, you would use a service like SendGrid, Mailgun, etc.

export async function sendVerificationEmail(email: string, otp: string) {
    // In a real application, you would send an actual email
    console.log(`Sending verification email to ${email} with OTP: ${otp}`)
  
    // For development purposes, we'll just log the OTP
    // In production, you would use an email service
    return true
  }
  