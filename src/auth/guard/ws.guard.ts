import { JwtService } from '@nestjs/jwt';
// src/auth/jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private JwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const authToken = client.handshake?.headers?.authorization?.split(' ')[1];
    client.user = this.validateToken(authToken);
    return client.user;
  }

  async validateToken(authToken: string): Promise<boolean> {
    try {
      const user = await this.JwtService.verify(authToken); // 토큰을 검증하고 유저 정보를 가져옵니다.
      return user;
    } catch (error) {
      return false;
    }
  }
}
