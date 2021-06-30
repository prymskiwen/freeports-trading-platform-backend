import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { permittedCrossDomainPolicies } from 'helmet';
import { UserDocument } from 'src/schema/user/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDocument, token: string) {
    const url = `http://${process.env.HOST_NAME}/auth/${token}/password`;
    const name = user.personal.nickname;
    console.log(user.personal.email);

    if (process.env.MAIL_HOST) {
      await this.mailerService
        .sendMail({
          to: user.personal.email,
          from: `"No Reply" <${process.env.MAIL_FROM}>`, // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          text: 'Email Verify',
          html: `<p>Hey ${name},</p>
        <p>Please click below to confirm your email</p>
        <p>
            <a href="${url}">Confirm</a>
        </p>`,
        })
        .then((res) => {
          console.log('ok perfact');
          console.log(res);
        })
        .catch((err) => {
          console.log('ok errors');
          console.log(err);
        });
    } else {
      console.log('Mail host not set, mail:', url);
    }
  }
}
