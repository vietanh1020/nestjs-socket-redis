import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
