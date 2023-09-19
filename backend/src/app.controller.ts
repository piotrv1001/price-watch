import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { CombinedAuthGuard } from './auth/guards/combined-auth.guard';
import { RtAuthGuard } from './auth/guards/rt-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Request() req) {
    return this.authService.register(req.body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(CombinedAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(RtAuthGuard)
  @Post('auth/refresh')
  async refresh(@Request() req) {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(CombinedAuthGuard)
  @Get('authenticate')
  authenticate(@Request() req) {
    return req.user;
  }

  @Post('auth/verify-token')
  async verifyToken(@Body() body: { idToken: string }, @Res() res) {
    try {
      const decodedToken = await this.authService.verifyFirebaseToken(
        body.idToken,
      );
      await this.authService.findOrCreateUser(decodedToken);
      res.status(200).send();
    } catch (error) {
      res.status(401).send();
    }
  }
}
