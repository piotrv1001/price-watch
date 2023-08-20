import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('FirebaseAdmin') private readonly firebaseAdmin: admin.app.App,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDTO: CreateUserDto) {
    return await this.userService.create(createUserDTO);
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
    const { uid, email } = decodedToken;
    const user = await this.userService.getByUId(uid);
    if (!user) {
      const newUser = new CreateUserDto();
      newUser.u_id = uid;
      newUser.username = email;
      return await this.userService.create(newUser);
    }
    return user;
  }
}
