import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';
import { User } from 'src/user/user.entity';

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject('FirebaseAdmin') private readonly firebaseAdmin: admin.app.App,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, rtHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<Tokens> {
    const userId = user.id;
    const tokens = await this.getTokens(userId);
    await this.updateRtHash(userId, tokens.refresh_token);
    return tokens;
  }

  async register(createUserDTO: CreateUserDto) {
    return await this.userService.create(createUserDTO);
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userService.getUserByIdWithNullRtHash(userId);
    if (!user) {
      return;
    }
    await this.updateRtHash(userId, null);
  }

  async verifyFirebaseToken(
    idToken: string,
  ): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseAdmin
        .auth()
        .verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw error;
    }
  }

  async findOrCreateUser(
    decodedToken: admin.auth.DecodedIdToken,
  ): Promise<User> {
    const { uid, email, picture, name } = decodedToken;
    const user = await this.userService.getByUId(uid);
    if (!user) {
      const newUser = new CreateUserDto();
      newUser.u_id = uid;
      newUser.email = email;
      newUser.profilePic = picture;
      newUser.displayName = name;
      return await this.userService.create(newUser);
    } else {
      user.email = email;
      user.profilePic = picture;
      user.displayName = name;
      return await this.userService.partialUpdate(user);
    }
  }

  async getTokens(userId: number): Promise<Tokens> {
    const payload = { sub: userId };
    const atPromise = this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    const rtPromise = this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const [accessToken, refreshToken] = await Promise.all([
      atPromise,
      rtPromise,
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const rtHash = user.rtHash;
    const hashMatches = await bcrypt.compare(refreshToken, rtHash);
    if (!hashMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const tokens = await this.getTokens(userId);
    await this.updateRtHash(userId, tokens.refresh_token);
    return tokens;
  }

  async updateRtHash(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userService.updateRtHash(userId, refreshToken);
  }
}
