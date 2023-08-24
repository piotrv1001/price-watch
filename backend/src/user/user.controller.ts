import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile-picture')
  async getProfilePicture(@Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.getById(userId);
    return { profilePic: user.profilePic, email: user.email };
  }
}
