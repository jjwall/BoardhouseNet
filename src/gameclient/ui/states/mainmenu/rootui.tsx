import { GlobalGameState } from "../../store/context/globalgamecontext";
import { createJSXElement } from "../../core/createjsxelement";
import { InputBox } from "../../basecomponents/inputbox";
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
// Todo: Spectate / Play button is disabled until world is "loaded"
// Todo: Pulse state / context updates upon clicking Play

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
            <panel
                top="50"
                left="50"
                height="620"
                width="1180"
                color="#282828"
                opacity="0.5"
            >
                {/* Logo */}
                <panel 
                    img="./assets/textures/logos/quest_for_the_kingmaker.png" 
                    top="-50"
                    width="375" 
                    height="275"
                    left="370"
                />
                {/* Char display box */}
                <panel 
                    color="#A9A9A9"
                    top="150"
                    width="200" 
                    height="200"
                    left="470"
                    opacity="0.5"
                />
                {/* Class select text */}
                <Text top="375" left="500" contents="Class select:"></Text>
                {/* Class display text */}
                <Text top="395" left="520" contents="Knight"></Text>
                {/* Left Arrow */}
                <Button
                    top={380}
                    left={500}
                    height={15}
                    width={15}
                    opacity={1}
                    pressedLayout="#018786"
                    unpressedLayout="#03DAC6"
                    submit={() => console.log("change class")}
                >
                </Button>
                {/* Right Arrow */}
                <Button
                    top={380}
                    left={600}
                    height={15}
                    width={15}
                    opacity={1}
                    pressedLayout="#018786"
                    unpressedLayout="#03DAC6"
                    submit={() => console.log("change class")}
                >
                </Button>
                {/* Username text */}
                <Text top="415" left="505" contents="Username:"></Text>
                {/* Username input box */}
                <InputBox
                    boxColor="#C9CFFF"
                    borderColor="#000000"
                    top="425"
                    left="500"
                    fontTop="18"
                    width={120}
                    height={20}
                    contents={"Type here..."}
                />
                {/* Spectate text */}
                <Text top="470" left="505" contents="Spectate:"></Text>
                {/* Spectate checkbox stub */}
                <panel 
                    color="#A9A9A9"
                    top="480"
                    width="15" 
                    height="15"
                    left="500"
                    opacity="0.5"
                />

                {/* Button text */}
                <Text top="545" left="525" contents="Play"></Text>
                {/* Play Button */}
                <Button
                    top={515}
                    left={500}
                    height={75}
                    width={150}
                    opacity={1}
                    pressedLayout="#018786"
                    unpressedLayout="#03DAC6"
                    submit={() => this.props.onPlay()}
                >
                </Button>
            </panel>
        )
    }
}