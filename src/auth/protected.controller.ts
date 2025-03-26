import { Controller, Get, UseGuards } from '@nestjs/common';
import { KeycloakGuard } from './keycloak.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('protected')
@UseGuards(KeycloakGuard)
export class ProtectedController {
  @Get('public')
  getPublicContent() {
    return {
      message: 'Đây là nội dung công khai dành cho bất kỳ người dùng xác thực nào',
    };
  }

  @Get('admin')
  @Roles('admin', 'create_course')
  @UseGuards(RolesGuard)
  getAdminContent() {
    return {
      message: 'Đây là nội dung dành riêng cho quản trị viên',
    };
  }

  @Get('teacher')
  @Roles('admin')
  @UseGuards(RolesGuard)
  getTeacherContent() {
    return {
      message: 'Đây là nội dung dành riêng cho giáo viên',
    };
  }

  @Get('student')
  @Roles('student')
  @UseGuards(RolesGuard)
  getStudentContent() {
    return {
      message: 'Đây là nội dung dành riêng cho học sinh',
    };
  }
} 