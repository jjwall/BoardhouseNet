export enum NetWorldEventTypes {
    LOAD_WORLD = "LOAD_WORLD", // load tile world?
    UNLOAD_WORLD = "UNLOAD_WORLD", // this would be a client side event
    UNLOAD_WORLD_LOAD_WORLD = "UNLOAD_WORLD_LOAD_WORLD",
    PLAYER_WORLD_TRANSITION = "PLAYER_WORLD_TRANSITION"
}