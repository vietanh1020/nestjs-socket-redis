import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { KeycloakConfigService } from './keycloak.config';

@Injectable()
export class KeycloakGuard implements CanActivate {
  private readonly logger = new Logger(KeycloakGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly keycloakConfigService: KeycloakConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      // Validate token với Keycloak
      const isValid = await this.validateToken(token);
      
      if (!isValid) {
        throw new UnauthorizedException('Invalid token');
      }
      
      return true;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      // Gọi API introspect của Keycloak để kiểm tra token
      const response = await fetch(
        `${this.keycloakConfigService.baseUrl}/realms/${this.keycloakConfigService.realm}/protocol/openid-connect/token/introspect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: this.keycloakConfigService.clientId,
            client_secret: this.keycloakConfigService.clientSecret,
            token,
          }).toString(),
        },
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.active === true;
    } catch (error) {
      this.logger.error(`Token introspection failed: ${error.message}`);
      return false;
    }
  }
} 