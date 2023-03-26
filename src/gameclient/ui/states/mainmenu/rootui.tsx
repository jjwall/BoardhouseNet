import { createJSXElement } from "../../core/createjsxelement";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Scene } from "three";

// Todo: Consider chatHistory max message count with new redux refactor.
// Todo: Refactor all components that care about application state / context to use mapContextToProps
// Todo: Rename "initialState" with globalGameState OR globalGameContext. State may make more sense.
// Todo: Remove all setState methods that were purely used for application state
// -> Keep component state methods using setState
// Todo: R&D on naming conventions for reducer consumers: i.e. our appendChatHistory2 method
// Todo: R&D on if having multiple stores is okay with current design.
// Todo: Reorganize redux layer's architecture. Consider best redux practices
// -> Current thought is to organize by feature. I.e:
// store/
//  L context.ts
//  L core/
//    L actiontypes.ts
//    L createstore.ts
//    L context.ts goes here?
//  L chat/
//    L reducers.ts
//    L actions.ts
//  L hud/
//    L reducers.ts
//    L actions.ts
//  L inputbox/
//    L reducers.ts
//    L actions.ts
//  L inventory/
//    L reducers.ts
//    L actions.ts

// Todo: Swap out main menu / gameplay ui and test
// Todo: General branch cleanup, commented out code, structure etc.

interface Props {}

export function renderMainMenuUi(scene: Scene, rootWidget: Widget, props: Props): MainMenuRoot {
    let rootInstance = renderWidget(<MainMenuRoot { ...props }/>, rootWidget, scene);

    return rootInstance.component as MainMenuRoot;
}

export class MainMenuRoot extends Component<Props, {}> {
    render(): JSXElement {
        return(
            <panel>
                <label contents="Main Menu" top="100"></label>
            </panel>
        )
    }
}