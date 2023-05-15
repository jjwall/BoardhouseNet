import { GlobalGameState } from "../../store/context/globalgamecontext";
import { createJSXElement } from "../../core/createjsxelement";
import { renderWidget } from "../../core/renderwidget";
import { Button } from "../../basecomponents/button";
import { JSXElement } from "../../core/interfaces";
import { Text } from "../../basecomponents/text";
import { Component } from "../../core/component";
import { Widget } from "../../core/widget";
import { Scene } from "three";

// Todo: (Done) Swap out main menu / gameplay ui and test
// *** MainMenu design ***
// Todo: (Done) -Press Start- flashes under the logo
// Todo: Basic class select screen?
// Todo: Refresh Spectator code
// Todo: Automatically force a client to join as a spectator -> THEN they can join as a player later on.
// -> They are able to join as a player or continue spectating
// -> Future spectate branch will create some spectate UI / controls
// Todo: General branch cleanup, commented out code, structure etc.
// Todo: Consider chatHistory max message count with new redux refactor.
// Todo (Done) (Bug): Button -> on release is misaligned. Need h/w + 1/2 treatment

export function renderMainMenuUi(scene: Scene, rootWidget: Widget, props: Props): MainMenuRoot {
    let rootInstance = renderWidget(<MainMenuRoot { ...props }/>, rootWidget, scene);

    return rootInstance.component as MainMenuRoot;
}

interface Props {
    onPlay?: () => void
}

export class MainMenuRoot extends Component<Props> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }

    mapContextToProps(context: GlobalGameState): Partial<GlobalGameState> {
        return { 
            onPlay: context.onPlay
        }
    }

    render(): JSXElement {
        return(
            <panel>
                <Button
                    top={100}
                    left={100}
                    height={100}
                    width={250}
                    pressedLayout="#018786"
                    unpressedLayout="#03DAC6"
                    submit={() => this.props.onPlay()}
                />
                <Text top="50" left="50" contents="testttttttttttt"></Text>
            </panel>
        )
    }
}