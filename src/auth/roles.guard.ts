import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import * as jwt from 'jsonwebtoken';
import { KeycloakConfigService } from 'src/keycloak/keycloak.config';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private keycloakConfigService: KeycloakConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Không yêu cầu role cụ thể
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      // Giải mã token để lấy thông tin role
      const decodedToken = jwt.decode(token) as any;
      
      if (!decodedToken) {
        return false;
      }

      // Lấy roles từ token, có thể khác nhau tùy theo cách cấu hình Keycloak
      const userRoles = decodedToken.realm_access?.roles || [];
      
      // Kiểm tra xem người dùng có ít nhất một trong các role yêu cầu không
      return requiredRoles.some(role => userRoles.includes(role));
    } catch (error) {
      this.logger.error(`Role checking failed: ${error.message}`);
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 