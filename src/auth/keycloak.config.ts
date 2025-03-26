import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakConfigService {
  constructor(private configService: ConfigService) {}

  get baseUrl(): string {
    return this.configService.get<string>('KEYCLOAK_BASE_URL') || 'http://localhost:8080';
  }

  get realm(): string {
    return this.configService.get<string>('KEYCLOAK_REALM') || 'eduplatform';
  }

  get clientId(): string {
    return this.configService.get<string>('KEYCLOAK_CLIENT_ID') || 'api-client';
  }

  get clientSecret(): string {
    return this.configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '';
  }

  get adminUsername(): string {
    return this.configService.get<string>('KEYCLOAK_ADMIN_USERNAME') || 'admin';
  }

  get adminPassword(): string {
    return this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD') || 'admin';
  }

  get keycloakConfig() {
    return {
      realm: this.realm,
      'auth-server-url': this.baseUrl,
      resource: this.clientId,
      'confidential-port': 0,
      'ssl-required': 'external',
      credentials: {
        secret: this.clientSecret,
      },
    };
  }
} 