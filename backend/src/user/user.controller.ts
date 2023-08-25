import { Controller, Get, UseGuards, Request, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, u_id, password, ...user } = await this.userService.getById(
      userId,
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile-picture')
  async getProfilePicture(@Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.getById(userId);
    return { profilePic: user.profilePic, email: user.email };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.getById(userId);
    user.displayName = req.body.displayName;
    user.email = req.body.email;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, u_id, password, ...updatedUser } =
      await this.userService.partialUpdate(user);
    return updatedUser;
  }
}
