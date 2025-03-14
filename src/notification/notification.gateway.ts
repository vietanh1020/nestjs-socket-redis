import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Cho phép kết nối từ bất kỳ origin nào
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  async onModuleInit() {
    // Kết nối Redis
    const pubClient = new Redis('redis://localhost:6379');
    const subClient = new Redis('redis://localhost:6379');

    this.server.adapter(createAdapter(pubClient, subClient));
    console.log('✅ Redis adapter connected!');
  }

  // Khi client kết nối
  handleConnection(client: Socket) {
    console.log(`🔗 User connected: ${client.id}`);
  }

  // Khi client ngắt kết nối
  handleDisconnect(client: Socket) {
    console.log(`❌ User disconnected: ${client.id}`);
  }

  // Lắng nghe sự kiện từ client và gửi lại cho toàn bộ user
  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() data: { message: string }) {
    console.log("SERVER 2", data);
    this.server.emit('receiveMessage', data);
  }
}
