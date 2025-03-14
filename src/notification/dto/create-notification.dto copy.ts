import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
