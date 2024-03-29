import { ClientWorldEventTypes, ClientWorldMessage } from "../../packets/messages/clientworldmessage";
import { ClientRoleTypes } from "../../packets/enums/clientroletypes";
import { findAndDestroyPlayerEntity } from "../messaging/helpers";
import { Server } from "./server";
import * as WebSocket from "ws";

export class MyWebSocket extends WebSocket {
    clientId: string;
    clientRole: ClientRoleTypes;
}

export function setUpGameServer(server: Server) {
    server.boardhouseServer = new MyWebSocket.Server({ port: Number(server.gameServerPort) });

    server.boardhouseServer.on("connection", function connection(ws: MyWebSocket) {
        console.log(`(port: ${server.gameServerPort}): client connected`);

        ws.on("message", function incoming(message) {
            console.log(`(port: ${server.gameServerPort}) received: ${message}`);
            const clientMessage: ClientWorldMessage = JSON.parse(message.toString());

            if (clientMessage.eventType === ClientWorldEventTypes.PLAYER_WORLD_JOIN) {
                ws.clientId = clientMessage.data.clientId;
                ws.clientRole = ClientRoleTypes.PLAYER;
                server.playerClientIds.push(clientMessage.data.clientId);
            }

            if (clientMessage.eventType === ClientWorldEventTypes.SPECTATOR_WORLD_JOIN) {
                ws.clientId = clientMessage.data.clientId;
                ws.clientRole = ClientRoleTypes.SPECTATOR;
                server.spectatorClientIds.push(clientMessage.data.clientId);
            }

            server.messagesToProcess.push(clientMessage);
        });

        ws.on("close", function() {
            switch (ws.clientRole) {
                case ClientRoleTypes.PLAYER:
                    const playerIndex = server.playerClientIds.indexOf(ws.clientId);

                    if (playerIndex > -1) {
                        server.playerClientIds.splice(playerIndex, 1);
                        console.log(`(port: ${server.gameServerPort}): player with clientId = "${ws.clientId}" disconnected`);

                        server.worldEngines.forEach(worldEngine => {
                            findAndDestroyPlayerEntity(worldEngine, ws.clientId);
                        });
                    }
                    break;
                case ClientRoleTypes.SPECTATOR:
                    const spectatorIndex = server.spectatorClientIds.indexOf(ws.clientId);

                    if (spectatorIndex > -1) {
                        server.spectatorClientIds.splice(spectatorIndex, 1);
                        console.log(`(port: ${server.gameServerPort}): spectator with clientId = "${ws.clientId}" disconnected`);
                    }
                    break;
            }
        })
    });
}