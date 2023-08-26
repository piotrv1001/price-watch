import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfig } from './email-config.entity';
import { EmailConfigService } from './email-config.service';
import { EmailConfigController } from './email-config.controller';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmailConfig]), UsersModule],
  providers: [EmailConfigService],
  controllers: [EmailConfigController],
})
export class EmailConfigModule {}
