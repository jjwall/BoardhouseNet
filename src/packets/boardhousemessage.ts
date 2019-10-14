export interface BoardhouseMessage {
    [loginUserId: string]: {
        left?: boolean;
        right?: boolean;
    }
}