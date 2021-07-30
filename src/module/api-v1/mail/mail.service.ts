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
      secure: true,
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

  async sendResetPasswordEmail(user: UserDocument, resetPasswordToken: string) {
    const url = `${process.env.HOST_NAME}/reset-password/${user._id}/${resetPasswordToken}`;
    const name = user.personal.nickname;

    const message = {
      from: this.mailFrom,
      to: user.personal.email,
      subject: 'Reset password',
      html: `<p>Hello ${name},</p>
            <p>Please click below to reset your password</p>
            <p>
                <a href="${url}">Reset Your Password</a>
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
}
