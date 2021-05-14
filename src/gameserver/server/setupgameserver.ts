import * as WebSocket from "ws";
import { NetEntityMessage } from "../../packets/netentitymessage";
import { ClientEventMessage } from "../../packets/clienteventmessage";
import { sendDestroyEntitiesMessage } from "../messaging/sendmessages";
import { Entity } from "../states/gameplay/entity";
import { ClientEventTypes } from "../../packets/clienteventtypes";
import { ClientRoleTypes } from "../../packets/clientroletypes";
import { Server } from "./server";
import { last } from "./helpers";

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
                        let ents = server.currentState.getEntitiesByKey<Entity>("player"); // could use netid here
                        findAndDestroyPlayerEntity(ents, ws.clientId, server);
                        // let ents = last(boardhouseBack.stateStack).getEntitiesByKey<Entity>("player");
                        // const player = ents.find(ent => ent.player.id === ws.clientId);
                        // console.log(player);
                        // sendDestroyEntityMessage(player, boardhouseBack);
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

function findAndDestroyPlayerEntity(ents: Entity[], clientId: string, server: Server) {
    let entsToDestroy: Entity[] = [];

    ents.forEach(ent => {
        if (ent.player) {
            if (ent.player.id === clientId) {
                entsToDestroy.push(ent);
            }
        }
    });

    sendDestroyEntitiesMessage(entsToDestroy, server);
}