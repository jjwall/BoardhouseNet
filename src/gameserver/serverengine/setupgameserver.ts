import * as WebSocket from "ws";
import { NetEntityMessage } from "../../packets/netentitymessage";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { sendDestroyEntitiesMessage } from "../messaging/sendmessages";
import { Entity } from "./entity";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { ClientRoleTypes } from "../../packets/clientroletypes";
import { Server } from "./server";
import { last } from "./helpers";
import { BaseWorldEngine } from "./baseworldengine";

class MyWebSocket extends WebSocket {
    clientId: string;
    clientRole: ClientRoleTypes;
}

export function setUpGameServer(server: Server) {
    server.boardhouseServer = new MyWebSocket.Server({ port: Number(server.gameServerPort) });

    server.boardhouseServer.on("connection", function connection(ws: MyWebSocket) {
        console.log(`(port: ${server.gameServerPort}): client connected`);

        ws.on("message", function incoming(message) {
            console.log(`(port: ${server.gameServerPort}) received: ${message}`);
            const clientMessage: ClientEventMessage = JSON.parse(message.toString());

            if (clientMessage.eventType === ClientEventTypes.PLAYER_JOINED) {
                ws.clientId = clientMessage.clientId;
                ws.clientRole = ClientRoleTypes.PLAYER;
                server.playerClientIds.push(clientMessage.clientId);
            }

            if (clientMessage.eventType === ClientEventTypes.SPECTATOR_JOINED) {
                ws.clientId = clientMessage.clientId;
                ws.clientRole = ClientRoleTypes.SPECTATOR;
                server.spectatorClientIds.push(clientMessage.clientId);
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
                            findAndDestroyPlayerEntity(worldEngine, ws.clientId, server);
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

function findAndDestroyPlayerEntity(worldEngine: BaseWorldEngine, clientId: string, server: Server) {
    const ents = worldEngine.getEntitiesByKey<Entity>("player");
    let entsToDestroy: Entity[] = [];

    ents.forEach(ent => {
        if (ent.player) {
            if (ent.player.id === clientId) {
                entsToDestroy.push(ent);
            }
        }
    });

    if (entsToDestroy.length > 0)
        sendDestroyEntitiesMessage(entsToDestroy, server, worldEngine);
}