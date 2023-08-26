import { Controller, Get, UseGuards, Request, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CombinedAuthGuard } from 'src/auth/guards/combined-auth.guard';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(CombinedAuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Res() res) {
    const user = await this.getUser(req.user);
    if (user == null) {
      res.status(404).send();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, u_id, password, ...strippedUser } = user;
    let isGoogleAccount = false;
    if (u_id != null) {
      isGoogleAccount = true;
    }
    return { ...strippedUser, isGoogleAccount };
  }

  @UseGuards(CombinedAuthGuard)
  @Get('profile-picture')
  async getProfilePicture(@Request() req, @Res() res) {
    const user = await this.getUser(req.user);
    if (user == null) {
      res.status(404).send();
    }
    return { profilePic: user.profilePic, email: user.email };
  }

  @UseGuards(CombinedAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Res() res) {
    const user = await this.getUser(req.user);
    if (user == null) {
      res.status(404).send();
    }
    user.displayName = req.body.displayName;
    user.email = req.body.email;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, u_id, password, ...updatedUser } =
      await this.userService.partialUpdate(user);
    return updatedUser;
  }

  private async getUser(user: any): Promise<User | null> {
    const uId = user?.uid;
    if (uId != null) {
      return await this.userService.getByUId(uId);
    }
    const id = user?.userId;
    if (id != null) {
      return await this.userService.getById(id);
    }
    return null;
  }
}
