import pug from "pug";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.EMAIL_PASSWORD);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class Email {
  constructor(email, name) {
    this.to = email;
    this.name = name;
    this.from = `${process.env.EMAIL_PROVIDER_ADDRESS}`;
  }

  //Setting the email transportation info
  newTransport() {
    return nodemailer.createTransport({
      host: process.env.DEV_EMAIL_HOST,
      port: process.env.DEV_EMAIL_PORT,
      auth: {
        user: process.env.DEV_EMAIL_USERNAME,
        pass: process.env.DEV_EMAIL_PASSWORD,
      },
    });
  }

  // Send the self-define email
  async send(subject, message) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: `${message}`,
    };

    if (process.env.APP_ENV === "prod") await sgMail.send(mailOptions);
    else await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(verifyUrl) {
    // 1) Create email content
    const templatePath = path.join(__dirname, "..", "views", "email.pug");
    const html = pug.renderFile(templatePath, {
      name: this.name,
      verify_url: verifyUrl,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: `Welcome to tickTock`,
      html,
    };

    // 3) Create a transport and send email
    if (process.env.APP_ENV === "prod") await sgMail.send(mailOptions);
    else await this.newTransport().sendMail(mailOptions);
  }
}
