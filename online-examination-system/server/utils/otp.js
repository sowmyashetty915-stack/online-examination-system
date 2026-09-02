
import crypto from "crypto";
import nodemailer from "nodemailer";


/*
|--------------------------------------------------------------------------
| GENERATE 6-DIGIT OTP
|--------------------------------------------------------------------------
*/
export function makeOtp() {
  return String(
    Math.floor(
      100000 + Math.random() * 900000
    )
  );
}


/*
|--------------------------------------------------------------------------
| HASH OTP
|--------------------------------------------------------------------------
| The actual OTP is never stored in MongoDB.
|--------------------------------------------------------------------------
*/
export function hashOtp(otp) {
  return crypto
    .createHash("sha256")
    .update(String(otp))
    .digest("hex");
}


/*
|--------------------------------------------------------------------------
| SEND OTP
|--------------------------------------------------------------------------
*/
export async function sendOtp(email, otp) {

  /*
  |--------------------------------------------------------------------------
  | DEVELOPMENT MODE
  |--------------------------------------------------------------------------
  | If SMTP is not configured, show OTP in server console.
  |--------------------------------------------------------------------------
  */
  if (!process.env.SMTP_HOST) {
    console.log(
      `[DEV OTP] ${email}: ${otp}`
    );

    return false;
  }


  /*
  |--------------------------------------------------------------------------
  | SMTP CONFIGURATION
  |--------------------------------------------------------------------------
  */
  const port = Number(
    process.env.SMTP_PORT || 587
  );

  const transporter =
    nodemailer.createTransport({
      host: process.env.SMTP_HOST,

      port,

      secure: port === 465,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });


  /*
  |--------------------------------------------------------------------------
  | SEND EMAIL
  |--------------------------------------------------------------------------
  */
  await transporter.sendMail({
    from: process.env.SMTP_FROM,

    to: email,

    subject:
      "Online Exam System - Email Verification OTP",

    text:
      `Your OTP is ${otp}. ` +
      `It expires in 10 minutes.`,
  });


  return true;
}
