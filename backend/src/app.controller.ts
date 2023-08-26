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
