import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ namespace: 'general' })
export class SocketEvents {
  @WebSocketServer()
  server: Server;
  public idToSocketMap = new Map<number, Socket>();

  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    const access_token = extractAccessTokenFromCookie(client);
    if (!access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token, true);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data = { id: user.id, username: user.username };
    this.idToSocketMap.set(user.id, client);
    client.join(`user_${user.id}`);
    client.join('general_online');
  }

  async handleDisconnect(client: Socket) {
    const user = await this.userService.findOneById(client.data.id);
    if (!user) return;
    this.idToSocketMap.delete(user.id);
  }
}
