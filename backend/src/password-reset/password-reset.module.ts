import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './password-reset.entity';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([PasswordReset]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `${process.env.EMAIL_SENDER} <${process.env.EMAIL_USERNAME}>`,
      },
    }),
  ],
  providers: [PasswordResetService],
  controllers: [PasswordResetController],
})
export class PasswordResetModule {}
