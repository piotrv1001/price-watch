import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EmailConfigService } from './email-config.service';
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';
import { UserService } from 'src/user/user.service';
import { CreateEmailConfigDTO } from './dto/create-email-config.dto';

@Controller('email-config')
export class EmailConfigController {
  constructor(
    private readonly emailConfigService: EmailConfigService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(CombinedAuthGuard)
  @Post()
  async createNewConfig(
    @Body() createEmailConfigDTO: CreateEmailConfigDTO,
    @Req() req: any,
  ) {
    const user = await this.userService.getUserFromRequest(req.user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...emailConfig } = await this.emailConfigService.create(
      createEmailConfigDTO,
      user.id,
    );
    return emailConfig;
  }

  @UseGuards(CombinedAuthGuard)
  @Get('user')
  async getByUserId(@Req() req: any) {
    const user = await this.userService.getUserFromRequest(req.user);
    const config = await this.emailConfigService.getByUserId(user.id);
    if (!config) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...emailConfig } = config;
    return emailConfig;
  }

  @UseGuards(CombinedAuthGuard)
  @Put()
  async update(
    @Body() emailConfig: CreateEmailConfigDTO,
    @Req() req: any,
    @Res() res: any,
  ) {
    const user = await this.userService.getUserFromRequest(req.user);
    const existingEmailConfig = await this.emailConfigService.getByUserId(
      user.id,
    );
    if (!existingEmailConfig) {
      return res.status(404).send();
    }
    existingEmailConfig.email = emailConfig.email;
    existingEmailConfig.dayOfWeek = emailConfig.dayOfWeek;
    existingEmailConfig.hour = emailConfig.hour;
    existingEmailConfig.minute = emailConfig.minute;
    existingEmailConfig.enabled = emailConfig.enabled;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...updatedConfig } = await this.emailConfigService.update(
      existingEmailConfig,
    );
    return res.status(204).json(updatedConfig);
  }
}
