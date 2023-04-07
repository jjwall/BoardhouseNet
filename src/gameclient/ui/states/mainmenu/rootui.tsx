import { createJSXElement } from "../../core/createjsxelement";
import { renderWidget } from "../../core/renderwidget";
import { JSXElement } from "../../core/interfaces";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Scene } from "three";
import { Text } from "../../basecomponents/text";

// Todo: Swap out main menu / gameplay ui and test
// *** MainMenu design ***
// Todo: -Press Start- flashes under the logo
// Todo: Basic class select screen?
// Todo: Refresh Spectator code
// Todo: Automatically force a client to join as a spectator -> THEN they can join as a player later on.
// -> They are able to join as a player or continue spectating
// -> Future spectate branch will create some spectate UI / controls
// Todo: General branch cleanup, commented out code, structure etc.
// Todo: Consider chatHistory max message count with new redux refactor.
// Todo: (Done) Refactor all components that care about application state / context to use mapContextToProps
// -> (Done) Chat
// -> (Done) ChatInputBox
// -> (Done) Inventory
// -> (Done) HUD
// -> (Done) NotificationWidget
// Todo: (Done) Rename "initialState" with (this) globalGameState OR globalGameContext.
// Todo: (Done) Remove all setState methods that were purely used for application state
// -> (Done) Keep component state methods using setState
// Todo: (Done)[See chatSlice] R&D on naming conventions for reducer consumers: i.e. our appendChatHistory2 method
// Todo: (Done)[Yes it's okay] R&D on if having multiple stores is okay with current design.
// Todo: (Done) Gameplay root state cleanup. Don't need to copy props to state like we currently do.
// Todo: (Done) Reorganize redux layer's architecture. Consider best redux practices
// -> Current thought is to organize by feature. I.e:
// store/
//  L context/
//    L globalgamestate.ts
//  L core/
//    L actiontypes.ts
//    L createstore.ts
//  L chat/ // scratch see features
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

export function renderMainMenuUi(scene: Scene, rootWidget: Widget, props: Props): MainMenuRoot {
    let rootInstance = renderWidget(<MainMenuRoot { ...props }/>, rootWidget, scene);

    return rootInstance.component as MainMenuRoot;
}

interface Props {}

interface State {
    pressKeyOpacity: number
    pressKeyOpacityIncrease: boolean
}

export class MainMenuRoot extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            pressKeyOpacity: 1,
            pressKeyOpacityIncrease: false
        }

        setInterval(() => {
            if (this.state.pressKeyOpacityIncrease)
                this.setState({
                    pressKeyOpacity: this.state.pressKeyOpacity += 0.01
                })
            else
                this.setState({
                    pressKeyOpacity: this.state.pressKeyOpacity -= 0.01
                })

            if (this.state.pressKeyOpacity < -0.25)
                this.setState({
                    pressKeyOpacityIncrease: true
                })

            if (this.state.pressKeyOpacity > 1.25)
                this.setState({
                    pressKeyOpacityIncrease: false
                })
        }, 15)
    }
    render(): JSXElement {
        return(
            <panel>
                <panel 
                    img="./assets/textures/logos/quest_for_the_kingmaker.png" 
                    width="750" 
                    height="550"
                    left="275"
                />
                <Text
                    top="425"
                    left="528"
                    fontSize="24"
                    contents="-Press Any Key-"
                    opacity={this.state.pressKeyOpacity}
                    shadowOffset={2}
                />
            </panel>
        )
    }
}