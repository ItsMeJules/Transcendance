import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	/*			 INFO POUR LE FRONT

		Un id unique du client
			- Le channel actuel du client (publics, prives, proteges par mdp)
			- Les channels auxquel il a acces
			- Users bloques

				INFO POUR LE BACK
		Un historique des messages :
			- bdd-row: | l'heure du msg | (PK) id | (FK) userId | (FK) channel | contenu du msg
			- Broadcast les donnees aux bons utilisateurs
			- Log
	*/
	

	handleConnection(client: Socket) {
		console.log("Client connected: ", client.id)
	}

	handleDisconnect(client: Socket) {
		console.log("Client disconnected: ", client.id)
	}

	@SubscribeMessage('message')
	handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
		this.server.emit('message', {data: data, clientId: client.id})
	}

}