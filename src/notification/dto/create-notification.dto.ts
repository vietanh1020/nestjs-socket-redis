import { IsEnum, IsOptional, IsString, IsDateString, ValidateIf, IsNumber } from 'class-validator';
import { ScheduleType, TargetType } from '../entity/notification.entity';

export class CreateNotificationDto {
  @IsString()
  message: string;

  @IsEnum(['once', 'daily', 'weekly', 'monthly'])
  scheduleType: ScheduleType;

  @ValidateIf((o) => o.scheduleType === 'once')
  @IsDateString({}, { message: 'exactTime phải là ngày hợp lệ' })
  @IsOptional()
  exactTime?: string;

  @ValidateIf((o) => o.scheduleType !== 'once')
  @IsString({ message: 'scheduledTime phải là chuỗi thời gian HH:mm:ss' })
  @IsOptional()
  scheduledTime?: string;

  @IsEnum(['all', 'group', 'user'])
  targetType: TargetType;

  @ValidateIf((o) => o.targetType !== 'all')
  @IsNumber({}, { message: 'targetId phải là số' })
  @IsOptional()
  targetId?: number;
}
