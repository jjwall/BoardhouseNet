import { Message } from "./message";
import { ClientInputTypes } from "./clientinputtypes";

export interface ClientInputMessage extends Message {
    inputType: ClientInputTypes,
    clientId: string,
    data: Object // interface ClientInputData { ... }
}