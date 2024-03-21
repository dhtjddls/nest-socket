import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import { WsAuthGuard } from 'src/auth/guard/ws.guard';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private rooms: { [key: string]: any } = {};

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('create_room')
  async handleCreateRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ): Promise<any> {
    console.log(data);
    const user = await client.user;
    if (!user.isAdmin) {
      return client.emit('error', 'Unauthorized');
    }
    // 간단한 방 생성 로직
    this.rooms[data.roomId] = [];
    this.server.emit('room_created', { roomId: data.roomId });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('invite_user')
  async handleInviteUser(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ): Promise<any> {
    const user = await client.user;
    if (!user.isAdmin) {
      return client.emit('error', 'Unauthorized');
    }
    // 사용자 초대 로직
    if (this.rooms[data.roomId]) {
      this.rooms[data.roomId].push(data.userId);
      this.server.to(data.userId).emit('invited', { roomId: data.roomId });
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: any): void {
    this.server.emit('new_message', data);
    // 메시지 전송 로직
    if (
      this.rooms[data.roomId] &&
      this.rooms[data.roomId].includes(data.userId)
    ) {
      this.server
        .to(data.roomId)
        .emit('new_message', { sender: data.sender, message: data.message });
    }
  }
}
