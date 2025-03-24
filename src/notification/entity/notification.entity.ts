import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type ScheduleType = 'once' | 'daily' | 'weekly' | 'monthly';
export type TargetType = 'all' | 'group' | 'user';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  message: string;

  @Column({ type: 'enum', enum: ['once', 'daily', 'weekly', 'monthly'] })
  scheduleType: ScheduleType;

  @Column({ type: 'time', nullable: true }) 
  scheduledTime: string;

  @Column({ type: 'datetime', nullable: true }) 
  exactTime: Date;

  @Column({ default: false })
  @IsBoolean()
  isActive: boolean;

  @Column({ type: 'enum', enum: ['all', 'group', 'user'] })
  targetType: TargetType;

  @Column({ nullable: true }) 
  targetId?: number; // Lưu groupId hoặc userId nếu cần

  @CreateDateColumn()
  createdAt: Date;
}
