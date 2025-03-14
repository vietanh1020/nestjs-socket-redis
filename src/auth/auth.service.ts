import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private oauthClient: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.oauthClient = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
  }

  async verifyGoogleToken(token: string) {
    // Xác thực ID Token với Google
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid Google Token');

    // Kiểm tra user trong database (ví dụ giả định)
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
    };

    // Tạo JWT Token
    const accessToken = this.jwtService.sign(user);

    return {
      message: 'User authenticated',
      user,
      accessToken,
    };
  }
}
