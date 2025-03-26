import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { KeycloakConfigService } from './keycloak.config';
import { Credentials } from '@keycloak/keycloak-admin-client/lib/utils/auth';

@Injectable()
export class KeycloakService implements OnApplicationBootstrap {
  private readonly logger = new Logger(KeycloakService.name);
  private kcAdminClient: KeycloakAdminClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly keycloakConfigService: KeycloakConfigService,
  ) {
    this.kcAdminClient = new KeycloakAdminClient({
      baseUrl: this.keycloakConfigService.baseUrl,
    });
  }

  async onApplicationBootstrap() {
    try {
      await this.authenticateAdmin();
      this.logger.log('Successfully authenticated with Keycloak Admin');
    } catch (error) {
      this.logger.error(`Failed to authenticate with Keycloak Admin: ${error.message}`);
    }
  }

  /**
   * Xác thực với tài khoản admin Keycloak
   */
  async authenticateAdmin() {
    const credentials: Credentials = {
      username: this.keycloakConfigService.adminUsername,
      password: this.keycloakConfigService.adminPassword,
      grantType: 'password',
      clientId: 'admin-cli',
    };

    await this.kcAdminClient.auth(credentials);
    
    // Đặt realm mặc định
    this.kcAdminClient.setConfig({
      realmName: this.keycloakConfigService.realm,
    });
  }

  /**
   * Tạo người dùng mới trong Keycloak
   */
  async createUser(userInput: {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    enabled?: boolean;
  }) {
    try {
      // await this.authenticateAdmin();

      // Tạo user
      const userId = await this.kcAdminClient.users.create({
        username: userInput.username,
        email: userInput.email,
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        enabled: userInput.enabled ?? true,
        emailVerified: true,
      });

      // Đặt mật khẩu nếu có
      if (userInput.password) {
        await this.kcAdminClient.users.resetPassword({
          id: typeof userId === 'string' ? userId : String(userId),
          credential: {
            temporary: false,
            type: 'password',
            value: userInput.password,
          },
        });
      }

      return { userId, success: true };
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Tạo role mới trong Keycloak
   */
  async createRole(roleName: string, description?: string) {
    try {
      // await this.authenticateAdmin();
      
      await this.kcAdminClient.roles.create({
        name: roleName,
        description,
      });
      
      return { success: true, roleName };
    } catch (error) {
      this.logger.error(`Failed to create role: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gán role cho người dùng
   */
  async assignRoleToUser(userId: string, roleName: string) {
    try {
      // await this.authenticateAdmin();
      
      // Lấy role
      const role = await this.kcAdminClient.roles.findOneByName({ name: roleName });
      
      if (!role) {
        throw new Error(`Role ${roleName} not found`);
      }

      // Gán role cho user
      await this.kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        roles: [{ 
          id: typeof role.id === 'string' ? role.id : String(role.id), 
          name: typeof role.name === 'string' ? role.name : String(role.name)
        }],
      });
      
      return { success: true, userId, roleName };
    } catch (error) {
      this.logger.error(`Failed to assign role to user: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Lấy thông tin người dùng theo ID
   */
  async getUserById(userId: string) {
    try {
      await this.authenticateAdmin();
      return await this.kcAdminClient.users.findOne({ id: userId });
    } catch (error) {
      this.logger.error(`Failed to get user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy danh sách tất cả người dùng
   */
  async getAllUsers() {
    try {
      await this.authenticateAdmin();
      return await this.kcAdminClient.users.find();
    } catch (error) {
      this.logger.error(`Failed to get all users: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy danh sách tất cả roles
   */
  async getAllRoles() {
    try {
      return await this.kcAdminClient.roles.find();
    } catch (error) {
      this.logger.error(`Failed to get all roles: ${error.message}`);
      throw error;
    }
  }

  /**
   * Xác thực người dùng và trả về token
   */
  async login(username: string, password: string) {
    try {
      // Xác thực với Keycloak
      const tokenResponse = await fetch(
        `${this.keycloakConfigService.baseUrl}/realms/${this.keycloakConfigService.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: this.keycloakConfigService.clientId,
            client_secret: this.keycloakConfigService.clientSecret,
            grant_type: 'password',
            username,
            password,
          }).toString(),
        },
      );

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error_description || 'Authentication failed');
      }

      const tokenData = await tokenResponse.json();
      return {
        success: true,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
} 