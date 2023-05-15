import { GlobalGameState } from "../../store/context/globalgamecontext";
import { createJSXElement } from "../../core/createjsxelement";
import { NotificationWidget } from "./notificationwidget";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Inventory } from "./inventory";
import { Scene } from "three";
import { Chat } from "./chat";
import { HUD } from "./hud";

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): GameplayRoot {
    let rootInstance = renderWidget(<GameplayRoot { ...props }/>, rootWidget, scene);

    return rootInstance.component as GameplayRoot;
}

interface Props {
    globalGameState: GlobalGameState
}

export class GameplayRoot extends Component<Props> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    render(): JSXElement {
        return(
            <panel>
                <NotificationWidget
                    top="150"
                    left="440"
                />
                <HUD
                    top="0"
                    left="0"
                />
                <Chat
                    top="271"
                    left="24"
                    color="#282828"
                    opacity="0.5"
                />
                <Inventory
                    top="456"
                    left="975"
                    color="#282828"
                    opacity="0.5"
                />
            </panel>
        )
    }
}