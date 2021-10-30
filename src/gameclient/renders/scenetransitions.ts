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
    public fade: FadeComponent;
    public ticks: number;
    public onDone: () => void;
}

export interface FadeComponent {
    trigger: () => void;
}

export function renderSceneFadeOut(client: Client, onDone?: () => void) {
    console.log("scene fade in");

    // Set client sceneTransitionDone field to false.
    client.sceneTransitionDone = false;

    // Set up transition mesh.
    let sceneTransition = new SceneTransition(50);
    const cameraPos = client.gameCamera.position;
    sceneTransition.pos = setPosition(cameraPos.x, cameraPos.y, 25);
    sceneTransition.pos.teleport = true;
    const geometry = new PlaneGeometry(10000, 5000);
    const material = new MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0 });
    sceneTransition.sprite = new Mesh(geometry, material);
    sceneTransition.fade = { trigger: null };

    sceneTransition.fade.trigger = function() {
        (sceneTransition.sprite.material as Material).opacity += 0.02;
    }

    if (onDone)
        sceneTransition.onDone = onDone;

    // Add transition mesh to game scene.
    client.gameScene.add(sceneTransition.sprite);

    // Set client scene transition field.
    client.sceneTransition = sceneTransition;
}

export function renderSceneFadeIn(client: Client) {
    console.log("scene fade in");

    // Set client sceneTransitionDone field to false.
    client.sceneTransitionDone = false;

    // Set up transition mesh.
    let sceneTransition = new SceneTransition(25);
    const cameraPos = client.gameCamera.position;
    sceneTransition.pos = setPosition(cameraPos.x, cameraPos.y, 25);
    sceneTransition.pos.teleport = true;
    const geometry = new PlaneGeometry(10000, 5000);
    const material = new MeshBasicMaterial({ color: '#000000', transparent: true });
    sceneTransition.sprite = new Mesh(geometry, material);
    sceneTransition.fade = { trigger: null };

    sceneTransition.fade.trigger = function() {
        (sceneTransition.sprite.material as Material).opacity -= 0.04;
    }

    // Add transition mesh to game scene.
    client.gameScene.add(sceneTransition.sprite);

    // Set client scene transition field.
    client.sceneTransition = sceneTransition;
}