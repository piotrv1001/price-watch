import { Controller, Get, UseGuards, Request, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('id')
  async getId(@Request() req, @Res() res) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      return res.status(404).send();
    } else {
      return res.status(200).json({ id: user.id });
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req, @Res() res) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      res.status(404).send();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, u_id, password, ...strippedUser } = user;
      let isGoogleAccount = false;
      if (u_id != null) {
        isGoogleAccount = true;
      }
      const resJson = { ...strippedUser, isGoogleAccount };
      res.status(200).json(resJson);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile-picture')
  async getProfilePicture(@Request() req, @Res() res) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      res.status(404).send();
    } else {
      const resJson = { profilePic: user.profilePic, email: user.email };
      res.status(200).json(resJson);
    }
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Res() res) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      res.status(404).send();
    } else {
      user.displayName = req.body.displayName;
      user.email = req.body.email;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, u_id, password, ...updatedUser } =
        await this.userService.partialUpdate(user);
      res.status(200).json(updatedUser);
    }
  }
}
