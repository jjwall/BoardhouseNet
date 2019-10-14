import { IBoardHouseFront } from "./interfaces";
import { BoardhouseMessage } from "../../packets/boardhousemessage";

export function messageHandlerSystem(boardHouseFront: IBoardHouseFront) {
    boardHouseFront.connection.onmessage = function(message: MessageEvent) {
        const jsonData: BoardhouseMessage = JSON.parse(message.data);
        console.log("boardhouse: back to front message");
    }
}