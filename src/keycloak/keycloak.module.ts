import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakService } from './keycloak.service';
import { KeycloakConfigService } from './keycloak.config';
import { KeycloakController } from './keycloak.controller';
import { KeycloakGuard } from './keycloak.guard';

@Module({
  imports: [ConfigModule],
  controllers: [KeycloakController],
  providers: [
    KeycloakService,
    KeycloakConfigService,
    KeycloakGuard,
  ],
  exports: [
    KeycloakService,
    KeycloakConfigService,
    KeycloakGuard,
  ],
})
export class KeycloakModule {} 