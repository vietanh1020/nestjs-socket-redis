import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entity/notification.entity';
import {  UpdateNotificationDto } from './dto/update-notification.dto';
import { CreateNotificationDto } from './dto/create-notification.dto copy';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notiRepository: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}


  sendNotificationToAll(message: string) {
    this.notificationGateway.server.emit('receiveMessage', { message });
  }

  async create(createNotiDto: CreateNotificationDto): Promise<Notification> {
    const newNoti = this.notiRepository.create(createNotiDto);
    return this.notiRepository.save(newNoti);
  }

  async findAll(): Promise<Notification[]> {
    return this.notiRepository.find();
  }

  async findOne(id: number): Promise<Notification> {
    const noti = await this.notiRepository.findOne({ where: { id } });
    if (!noti) throw new NotFoundException('Notification not found');
    return noti;
  }
  
  async activeNoti(id){
    const noti = await this.findOne(id);
    Object.assign(noti, {isActive: 1});
    return this.notiRepository.save(noti);
  }


  async update(id: number, updateNotiDto: UpdateNotificationDto): Promise<Notification> {
    const noti = await this.findOne(id);
    Object.assign(noti, updateNotiDto);
    return this.notiRepository.save(noti);
  }

  async remove(id: number): Promise<void> {
    const result = await this.notiRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Notification not found');
  }

  // sendToAllUsers(message: string) {
  //   this.notificationGateway.sendNotificationToAll(message);
  // }

  // sendToGroup(group: string, message: string) {
  //   this.notificationGateway.sendNotificationToGroup(group, message);
  // }

  // sendToUser(userId: string, message: string) {
  //   this.notificationGateway.sendNotificationToUser(userId, message);
  // }

}
