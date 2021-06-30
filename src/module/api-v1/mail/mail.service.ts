import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { permittedCrossDomainPolicies } from 'helmet';
import { UserDocument } from 'src/schema/user/user.schema';

// const mailjet = require('node-mailjet').connect(
//   'c6bed63439059ae8c061cdd9e19a0bc7',
//   'cd38ffd49f9268233bbcc40a8c4886a6',
// );

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDocument, token: string) {
    const url = `http://${process.env.HOST_NAME}/auth/${token}/password`;
    const name = user.personal.nickname;
    // console.log(user.personal.email);
    await this.mailerService
      .sendMail({
        to: 'forethink888@gmail.com',
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
    // const request = mailjet.post('send', { version: 'v3.1' }).request({
    //   Messages: [
    //     {
    //       From: {
    //         Email: 'sergiutestwork@outlook.com',
    //         Name: 'Mailjet Pilot',
    //       },
    //       To: [
    //         {
    //           Email: 'forethink888@gmail.com',
    //           Name: 'passenger 1',
    //         },
    //       ],
    //       Subject: 'Your email flight plan!',
    //       TextPart:
    //         'Dear passenger 1, welcome to Mailjet! May the delivery force be with you!',
    //       HTMLPart:
    //         '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
    //     },
    //   ],
    // });
    // request
    //   .then((result) => {
    //     console.log(result.body);
    //   })
    //   .catch((err) => {
    //     console.log(err.statusCode);
    //   });
  }
}
