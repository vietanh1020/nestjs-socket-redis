import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { KeycloakService } from './keycloak.service';
import { KeycloakConfigService } from './keycloak.config';
import { KeycloakController } from './keycloak.controller';
import { KeycloakGuard } from './keycloak.guard';
import { RolesGuard } from './roles.guard';
import { ProtectedController } from './protected.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, KeycloakController, ProtectedController],
  providers: [
    AuthService,
    KeycloakService,
    KeycloakConfigService,
    KeycloakGuard,
    RolesGuard,
  ],
  exports: [
    AuthService,
    KeycloakService,
    KeycloakConfigService,
    KeycloakGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
