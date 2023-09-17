import {
  Controller,
  Get,
  UseGuards,
  Request,
  Put,
  Res,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
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
      return res.status(404).send();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, u_id, password, rtHash, ...strippedUser } = user;
      let isGoogleAccount = false;
      if (u_id != null) {
        isGoogleAccount = true;
      }
      const resJson = { ...strippedUser, isGoogleAccount };
      return res.status(200).json(resJson);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile-picture')
  async getProfilePicture(@Request() req, @Res() res) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      return res.status(404).send();
    } else {
      const resJson = {
        profilePic: user.profilePic,
        email: user.email,
        displayName: user.displayName,
      };
      return res.status(200).json(resJson);
    }
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Res() res) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      return res.status(404).send();
    } else {
      user.displayName = req.body.displayName;
      user.email = req.body.email;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, u_id, password, rtHash, ...updatedUser } =
        await this.userService.partialUpdate(user);
      return res.status(200).json(updatedUser);
    }
  }

  @UseGuards(AuthGuard)
  @Get('favorite-products')
  async getFavoriteProducts(@Request() req, @Res() res) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      return res.status(404).send();
    } else {
      const favoriteProducts =
        await this.userService.findFavoriteProductsByUserId(user.id);
      return res.status(200).json(favoriteProducts);
    }
  }

  @UseGuards(AuthGuard)
  @Post('favorite-products/:productId')
  async addFavoriteProduct(
    @Request() req,
    @Res() res,
    @Param('productId') productId: string,
  ) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      return res.status(404).send();
    } else {
      const favoriteProducts = await this.userService.addNewFavoriteProduct(
        user.id,
        productId,
      );
      if (favoriteProducts == null) {
        return res.status(404).send();
      }
      return res.status(200).json(favoriteProducts);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('favorite-products/:productId')
  async deleteFavoriteProduct(
    @Request() req,
    @Res() res,
    @Param('productId') productId: string,
  ) {
    const user = await this.userService.getUserFromRequest(req.user);
    if (user == null) {
      return res.status(404).send();
    } else {
      const favoriteProducts = await this.userService.deleteFavoriteProduct(
        user.id,
        productId,
      );
      if (favoriteProducts == null) {
        return res.status(404).send();
      }
      return res.status(200).json(favoriteProducts);
    }
  }
}
