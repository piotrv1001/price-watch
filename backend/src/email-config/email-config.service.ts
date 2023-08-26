import { CreateEmailConfigDTO } from './dto/create-email-config.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EmailConfig } from './email-config.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailConfigService {
  constructor(
    @InjectRepository(EmailConfig)
    private readonly emailConfigRepository: Repository<EmailConfig>,
  ) {}

  async create(
    createEmailConfigDTO: CreateEmailConfigDTO,
    userId: number,
  ): Promise<EmailConfig> {
    const emailConfig = new EmailConfig();
    emailConfig.email = createEmailConfigDTO.email;
    emailConfig.dayOfWeek = createEmailConfigDTO.dayOfWeek;
    emailConfig.hour = createEmailConfigDTO.hour;
    emailConfig.minute = createEmailConfigDTO.minute;
    emailConfig.enabled = createEmailConfigDTO.enabled;
    emailConfig.userId = userId;
    return this.emailConfigRepository.save(emailConfig);
  }

  async update(emailConfig: EmailConfig): Promise<EmailConfig> {
    return this.emailConfigRepository.save(emailConfig);
  }

  async getByUserId(userId: number): Promise<EmailConfig> {
    return this.emailConfigRepository.findOneBy({ userId: userId });
  }
}
