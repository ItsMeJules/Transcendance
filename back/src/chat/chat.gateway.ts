import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		console.log("Client connected: ", client.id)
	}

	handleDisconnect(client: Socket) {
		console.log("Client disconnected: ", client.id)
	}

	@SubscribeMessage('message')
	handleEvent(@MessageBody() data: string) {
		this.server.emit('message', data)	
	}

}