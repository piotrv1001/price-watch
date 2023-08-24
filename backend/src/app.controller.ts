import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('authenticate')
  getProfile(@Request() req) {
    return req.user.userId;
  }

  @Post('auth/verify-token')
  async verifyToken(@Body() body: { idToken: string }) {
    try {
      const decodedToken = await this.authService.verifyFirebaseToken(
        body.idToken,
      );
      const user = await this.authService.findOrCreateUser(decodedToken);
      const customJwtToken = await this.authService.login(user);
      return { token: customJwtToken };
    } catch (error) {
      console.log(error);
    }
  }
}
