import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  message: string;

  @Column({ default: false })
  @IsBoolean()
  isRead: boolean;


  @Column({ default: false })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
