import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { permittedCrossDomainPolicies } from 'helmet';
import { UserDocument } from 'src/schema/user/user.schema';

const mailjet = require('node-mailjet').connect(
  'c6bed63439059ae8c061cdd9e19a0bc7',
  'cd38ffd49f9268233bbcc40a8c4886a6',
);

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDocument, token: string) {
    const url = `http://${process.env.HOST_NAME}/auth/${token}/password`;
    const name = user.personal.nickname;
    // console.log(user.personal.email);
    // await this.mailerService
    //   .sendMail({
    //     to: 'forethink888@gmail.com',
    //     from: `"No Reply" <${process.env.MAIL_FROM}>`, // override default from
    //     subject: 'Welcome to Nice App! Confirm your Email',
    //     template: './confirmation',
    //     context: {
    //       name: name,
    //       url: url,
    //     },
    //   })
    //   .then((res) => {
    //     console.log('ok perfact');
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log('ok errors');
    //     console.log(err);
    //   });
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAIL_FROM,
            Name: 'Support Team',
          },
          To: [
            {
              Email: user.personal.email,
              Name: name,
            },
          ],
          Subject: 'Welcome to Nice App! Confirm your Email',
          TextPart: '',
          HTMLPart: `<p>Hey ${name},</p>
            <p>Please click below to confirm your email</p>
            <p>
                <a href="${url}">Confirm</a>
            </p>`,
        },
      ],
    });
    request
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  }
}
