import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/schema/user/user.schema';

const nodemailer = require('nodemailer');

@Injectable()
export class MailService {
  private mailer: any;
  private mailFrom: string;

  constructor(private mailerService: MailerService) {
    const smtpConfig = {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE === 'true',
      requireTLS: process.env.MAIL_REQUIRETLS === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      }
    };
    this.mailer = nodemailer.createTransport(smtpConfig);
    this.mailFrom = process.env.MAIL_FROM;
  }

  async sendUserConfirmation(user: UserDocument, token: string) {
    const url = `${process.env.HOST_NAME}/auth/${token}/password`;
    const name = user.personal.nickname;

    const message = {
      from: this.mailFrom,
      to: user.personal.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      html: `<p>Hey ${name},</p>
            <p>Please click below to confirm your email</p>
            <p>
                <a href="${url}">Confirm</a>
            </p>`
    };

    this.mailer.sendMail(message, (error) => {
      if (error) {
        console.log(error, error.message);
        return;
      }
      console.log('Message sent successfully!');
    });
  }

  async sendResetPasswordEmail(user: UserDocument, resetPasswordToken: string, clearerUser: boolean) {
    const url = `${clearerUser ? process.env.HOST_CLEARER : process.env.HOST_ORGANIZATION}/reset-password/${user._id}/${resetPasswordToken}`;
    const name = user.personal.nickname;

    const message = {
      from: this.mailFrom,
      to: user.personal.email,
      subject: 'Update your password on Freeports Trading Platform',
      html: `<p>Hello ${name},</p>
            <p>You are receiving this email because you are invited to define a new password on your account. If you received this email by error, just ignore and delete it.</p>
            <p>
                <a href="${url}">Click here to define your password</a>
            </p>
            <p>
              Once your password is defined, you can use your email and the new password to login onto the Platform.
            </p>`
    };

    return new Promise((resolve, reject) => {
      this.mailer.sendMail(message, (error) => {
        if (error) {
          console.log(error, error.message);
          resolve({ success: false });
        } else {
          console.log('Message sent successfully!');
          resolve({ success: true });
        }
      });
    })
  }
}
