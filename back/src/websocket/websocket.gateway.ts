import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;
  
  private connectedUsers: Set<string> = new Set();
  
  handleConnection(client: any) {
    // Handle user connection
    const userId = client.handshake.query.userId;
    this.connectedUsers.add(userId);
    this.sendUserStatus(userId, true);
  }
  
  handleDisconnect(client: any) {
    // Handle user disconnection
    const userId = client.handshake.query.userId;
    this.connectedUsers.delete(userId);
    this.sendUserStatus(userId, false);
  }
  
  private sendUserStatus(userId: string, status: boolean) {
    // Emit event to update user status in frontend
    this.server.to(userId).emit('userStatus', status);
  }
}