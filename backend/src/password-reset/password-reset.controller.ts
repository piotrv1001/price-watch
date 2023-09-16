import { Body, Controller, Post, Res } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PasswordResetService } from './password-reset.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetDTO } from './dto/reset.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('password-reset')
export class PasswordResetController {
  constructor(
    private readonly passwordResetService: PasswordResetService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('forgot')
  async forgotPassword(@Body('email') email: string, @Res() res) {
    const randomToken = await this.generateUniqueToken();
    await this.passwordResetService.create(email, randomToken);
    const frontendUrl = process.env.FRONTEND_URL;
    const resetPasswordUrl = `${frontendUrl}/reset-password/${randomToken}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset your password!',
        html: `<p>Click <a href="${resetPasswordUrl}">here</a> to reset your password.</p>`,
      });
    } catch (e) {
      return res.status(500).send();
    }
    return res.status(200).send();
  }

  @Post('reset')
  async resetPassword(@Body() resetDTO: ResetDTO, @Res() res) {
    const { token, password } = resetDTO;
    if (!token || !password) {
      return res.status(400).send();
    }
    const passwordReset = await this.passwordResetService.findByToken(token);
    if (!passwordReset) {
      return res.status(400).send();
    }
    const user = await this.userService.getByEmail(passwordReset.email);
    if (!user) {
      return res.status(404).send();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(resetDTO.password, salt);
    user.password = hashedPassword;
    await this.userService.partialUpdate(user);
    await this.passwordResetService.delete(passwordReset.id);
    return res.status(200).send();
  }

  private async generateUniqueToken(): Promise<string> {
    let token: string;
    let isTokenUnique = false;

    while (!isTokenUnique) {
      token = uuidv4();
      const existingUser = await this.passwordResetService.findByToken(token);
      isTokenUnique = !existingUser;
    }
    return token;
  }
}
