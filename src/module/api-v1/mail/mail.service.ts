import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/schema/user/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDocument, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.personal.email,
      from: '"No Reply" <noreply@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      // template: './confirmation', // `.hbs` extension is appended automatically
      text: 'welcome',
      html: `<b>${url}</b>`,
      // context: { // ✏️ filling curly brackets with content
      //   name: user.personal.nickname,
      //   url,
      // },
    }).then(() => {})
    .catch(() => {});
  }
}
