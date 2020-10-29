import { ClientEngine } from "./clientengine";

export abstract class BaseClientState {
    protected constructor(engine: ClientEngine) {
        this.engine = engine;
    }

    public engine: ClientEngine;

    public abstract handleEvent(e: Event) : void;

    public abstract render() : void;
}