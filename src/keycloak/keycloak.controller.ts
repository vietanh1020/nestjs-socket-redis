import { Body, Controller, Get, Param, Post, UseGuards, Res } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { Response } from 'express';

@Controller('keycloak')
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }, @Res() res: Response) {
    const result = await this.keycloakService.login(loginDto.username, loginDto.password);
    
    if (result.success) {
      // Redirect to frontend with token
      return res.redirect(`${result.redirect_uri}?token=${result.access_token}`);
    }
    
    return res.status(401).json(result);
  }

  @Post('users')
  async createUser(
    @Body()
    createUserDto: {
      username: string;
      email: string;
      firstName?: string;
      lastName?: string;
      password?: string;
      enabled?: boolean;
    },
  ) {
    return this.keycloakService.createUser(createUserDto);
  }

  @Post('roles')
  async createRole(
    @Body() createRoleDto: { name: string; description?: string },
  ) {
    return this.keycloakService.createRole(
      createRoleDto.name,
      createRoleDto.description,
    );
  }

  @Post('assign-role')
  async assignRoleToUser(
    @Body() assignRoleDto: { userId: string; roleName: string },
  ) {
    return this.keycloakService.assignRoleToUser(assignRoleDto.userId, assignRoleDto.roleName);
  }

  @Get('users')
  async getAllUsers() {
    return this.keycloakService.getAllUsers();
  }

  @Get('users/:userId')
  async getUserById(@Param('userId') userId: string) {
    return this.keycloakService.getUserById(userId);
  }

  @Get('roles')
  async getAllRoles() {
    return this.keycloakService.getAllRoles();
  }
} 