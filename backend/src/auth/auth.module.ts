import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/user/user.module';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' }, // 60 minutes
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RtStrategy,
    {
      provide: 'FirebaseAdmin',
      useFactory: async () => {
        const serviceAccount = JSON.parse(
          readFileSync('firebase/firebase-admin-sdk.json', 'utf-8'),
        );
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        return admin;
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
