import { IBoardHouseFront } from "./interfaces";
import { BoardhouseMessage } from "../../packets/boardhousemessage";
import { Message } from "../../packets/message";

export function messageHandlerSystem(boardHouseFront: IBoardHouseFront) {
    boardHouseFront.connection.onmessage = function(messageEvent: MessageEvent) {
        const message: Message = JSON.parse(messageEvent.data);
        console.log("boardhouse: back to front message");

        if (message.type === "createEntity") {
            createEntity(message, boardHouseFront);
        }
    }
}

function createEntity(message: Message, boardHouseFront: IBoardHouseFront) {
    console.log("create entity front");
    console.log(message.data);
}