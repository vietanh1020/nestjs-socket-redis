import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('google-login')
    async googleLogin(@Body('IdToken') token: string) {
      return this.authService.verifyGoogleToken(token);
    }
}


