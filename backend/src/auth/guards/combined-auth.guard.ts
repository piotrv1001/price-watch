import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CombinedAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const firebaseAuthGuard = new FirebaseAuthGuard();
    const firebaseAuthResult = await firebaseAuthGuard.canActivate(context);
    if (firebaseAuthResult) {
      return true;
    }
    const jwtAuthGuard = new JwtAuthGuard();
    let jwtAuthResult = false;
    const jwtAuth = jwtAuthGuard.canActivate(context);
    if (typeof jwtAuth === 'boolean') {
      return jwtAuth;
    } else if (jwtAuth instanceof Promise) {
      jwtAuthResult = await jwtAuth;
    } else {
      jwtAuthResult = await firstValueFrom(jwtAuth);
    }
    return jwtAuthResult;
  }
}
