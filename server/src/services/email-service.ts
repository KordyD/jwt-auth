import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
import { join } from 'path';

class emailService {
  private transporter;
  constructor() {
    config({ path: join(__dirname, '..', '..', 'src', '.env') });
    this.transporter = createTransport({
      host: process.env.SMTP_HOST || 'str',
      port: Number(process.env.SMTP_PORT) || 123,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'str',
        pass: process.env.SMTP_PASSWORD || 'str',
      },
    });
  }
  async emailSent(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER || 'str',
      to,
      subject: `Account activation on ${process.env.API_URL || 'str'}`,
      text: '',
      html: `
        <div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `,
    });
  }
}

export default new emailService();
