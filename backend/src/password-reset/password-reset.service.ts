import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordReset } from './password-reset.entity';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
  ) {}

  async findByToken(token: string): Promise<PasswordReset | undefined> {
    return this.passwordResetRepository.findOne({ where: { token } });
  }

  async create(email: string, token: string): Promise<PasswordReset> {
    const passwordReset = new PasswordReset();
    passwordReset.email = email;
    passwordReset.token = token;
    return this.passwordResetRepository.save(passwordReset);
  }

  async delete(id: number): Promise<void> {
    await this.passwordResetRepository.delete(id);
  }
}
