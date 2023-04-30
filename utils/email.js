import nodemailer from "nodemailer";

export default class Email {
  constructor(email, name) {
    this.to = email;
    this.name = name;
    this.from = `tickTock <${process.env.EMAIL_PROVIDER_ADDRESS}>`;
  }

  //Setting the email transportation info
  newTransport() {
    if (process.env.APP_ENV === "prod") {

        return nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

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
    await this.newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html: `${message}`,
    });
  }

  async sendWelcome(host, token) {
    // 1) Create email content
    const html =
      `<h1>Welcome to TickTock</h1>` +
      `<h3>Please verify your email below.</h3>` +
      `<a href=${host}/api/v1/auths/verify_email?token=${token}>Confirm</a>`;

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: `Welcome to tickTock`,
      html,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
}
