export interface IPortToPendingRequestsMap {
    [port: string]: () => void;
}