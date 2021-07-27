import { Material, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { PositionComponent, setPosition } from "../components/position";
import { Client } from "../clientengine/client";
import { SpriteComponent } from "../components/sprite";

export class SceneTransition {
    constructor(ticks: number) {
        this.ticks = ticks; // TODO - get delta time for render ticks as some monitors will render faster than others. Renders should be based on time not render ticks...
    }

    public pos: PositionComponent;
    public sprite: SpriteComponent;
    public fadeOut: FadeComponent;
    public fadeIn: FadeComponent;
    public ticks: number;
}

export interface FadeComponent {
    ticks: number;
    trigger: () => void;
}

export function renderSceneFadeIn(client: Client) {
    console.log("scene fade in");
    let sceneTransition = new SceneTransition(100);
    const cameraPos = client.gameCamera.position;
    sceneTransition.pos = setPosition(cameraPos.x, cameraPos.y, 25);
    sceneTransition.pos.teleport = true;
    const geometry = new PlaneGeometry(10000, 5000);
    const material = new MeshBasicMaterial({ color: '#000000', transparent: true });
    sceneTransition.sprite = new Mesh(geometry, material);

    // clientRender.fadeIn = { ticks: 500, trigger: null };
    // clientRender.fadeIn.trigger = function() {
    //     (clientRender.sprite.material as Material).opacity += 0.005;
    // }

    sceneTransition.fadeOut = { ticks: 100, trigger: null };
    sceneTransition.fadeOut.trigger = function() {
        (sceneTransition.sprite.material as Material).opacity -= 0.01;
    }

    client.gameScene.add(sceneTransition.sprite);
    // clientRender.sprite = setSprite()
    client.sceneTransitions.push(sceneTransition);
}