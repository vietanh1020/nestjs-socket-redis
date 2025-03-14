import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto copy';
import { UpdateNotificationDto } from './dto/update-notification.dto';


@Controller('notification')
export class NotificationController {
  constructor(private readonly notiService: NotificationService) {}

  @Post()
  create(@Body() createNotiDto: CreateNotificationDto) {
    return this.notiService.create(createNotiDto);
  }
  

  @Post('active/:id')
  activeNoti(@Param('id') id: string,) {
    return this.notiService.activeNoti(id);
  }

  @Get()
  findAll() {
    return this.notiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotiDto: UpdateNotificationDto) {
    return this.notiService.update(+id, updateNotiDto);
  }

  @Post('send')
  sendNotification(@Body() body: { message: string }) {
    this.notiService.sendNotificationToAll(body.message);
    return { success: true, message: 'Notification sent to all users' };
  }
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notiService.remove(+id);
  }
}
