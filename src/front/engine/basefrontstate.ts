import { FrontEngine } from "./frontengine";

export abstract class BaseFrontState {
    protected constructor(engine: FrontEngine) {
        this.engine = engine;
    }

    public engine: FrontEngine;

    public abstract handleEvent(e: Event) : void;

    public abstract render() : void;
}