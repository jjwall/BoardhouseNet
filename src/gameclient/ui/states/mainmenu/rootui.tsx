import { PlayerClassTypes } from "../../../../packets/enums/playerclasstypes";
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

// *** General ***
// Todo: (Done) Swap out main menu / gameplay ui and test
// Todo: Refresh Spectator code
// Todo: Automatically force a client to join as a spectator -> THEN they can join as a player later on.
// -> They are able to join as a player or continue spectating
// -> Future spectate branch will create some spectate UI / controls
// Todo: General branch cleanup, commented out code, structure etc.
// Todo: Consider chatHistory max message count with new redux refactor.
// Todo: Spectate / Play button is disabled until world is "loaded"
// Todo: Pulse state / context updates upon clicking Play

// *** MainMenu design ***
// Todo: (Done) Cycle through classes with label and class image changing
// Todo: Implement input box handling for this ui screen
// Todo: Implement checkbox (generic component?)
// -> Change "Play" button label to "Spectate" when checked
// Todo: Cleanup mock to have a slimmer (less wide) component / panel
// Todo: Make mocked code into a "customize" component
// Todo: Specate / play has their own component
// Todo: Custom arrows for class select
// Todo: Custom checkmark
// Todo: Custom Play Button

export function renderMainMenuUi(scene: Scene, rootWidget: Widget, props: Props): MainMenuRoot {
    let rootInstance = renderWidget(<MainMenuRoot { ...props }/>, rootWidget, scene);

    return rootInstance.component as MainMenuRoot;
}

interface Props {
    onPlay?: () => void
}

interface State {
    classTypeIndex: number
    classDisplayImage: string
    spectateToggleBoolean: boolean
    spectateToggleContents: string
    playSpectateButtonContents: string
}

export class MainMenuRoot extends Component<Props, State> {
    classTypes = Object.values(PlayerClassTypes)
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            classTypeIndex: 3,
            classDisplayImage: "./assets/textures/knight/idle/Heroine_idle_04.png",
            spectateToggleBoolean: false,
            spectateToggleContents: " ",
            playSpectateButtonContents: "Play",
        }
    }

    mapContextToProps(context: GlobalGameState): Partial<GlobalGameState> {
        return { 
            onPlay: context.onPlay
        }
    }

    incrementClassTypeIndex() {
        if (this.state.classTypeIndex < this.classTypes.length - 1) {
            this.setState({ classTypeIndex: this.state.classTypeIndex + 1 })
        } else {
            this.setState({ classTypeIndex: 0 })
        }

        this.updateClassImageDisplay(this.classTypes[this.state.classTypeIndex])
    }

    decrementClassTypeIndex() {
        if (this.state.classTypeIndex > 0) {
            this.setState({ classTypeIndex: this.state.classTypeIndex - 1 })
        } else {
            this.setState({ classTypeIndex: this.classTypes.length - 1 })
        }

        this.updateClassImageDisplay(this.classTypes[this.state.classTypeIndex])
    }

    updateClassImageDisplay(classType: PlayerClassTypes) {
        switch(classType) {
            case PlayerClassTypes.KNIGHT:
                this.setState({ classDisplayImage: "./assets/textures/knight/idle/Heroine_idle_04.png"})
                break
            case PlayerClassTypes.RANGER:
                this.setState({ classDisplayImage: "./assets/textures/ranger/idle/Heroine_ranger_idle_04.png"})
                break
            case PlayerClassTypes.PAGE:
                this.setState({ classDisplayImage: "./assets/textures/page/idle/Heroine_page_idle_04.png"})
                break
            case PlayerClassTypes.WIZARD:
                this.setState({ classDisplayImage: "./assets/textures/wizard/idle/Heroine_wizard_idle_04.png"})
                break
        }
    }

    toggleSpectate() {
        if (this.state.spectateToggleBoolean)
            this.setState({ 
                spectateToggleBoolean: false, 
                spectateToggleContents: " ",
                playSpectateButtonContents: "Play",
            })
        else
            this.setState({ 
                spectateToggleBoolean: true, 
                spectateToggleContents: "x",
                playSpectateButtonContents: "Spectate"
            })
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
                {/* Player class display */}
                <panel 
                    img={this.state.classDisplayImage}
                    top="115"
                    width="64" 
                    height="64"
                    left="445"
                    pixel-ratio="4"
                />
                {/* Class select text */}
                <Text top="375" left="500" contents="Class select:"></Text>
                {/* Class display text */}
                <Text top="395" left="520" contents={this.classTypes[this.state.classTypeIndex]}></Text>
                {/* Left Arrow */}
                <Button
                    top={380}
                    left={500}
                    height={20}
                    width={20}
                    opacity={1}
                    fontTop={17}
                    fontLeft={4}
                    contents="<"
                    pressedLayout="#222034"
                    unpressedLayout="#3f3f74"
                    submit={() => this.decrementClassTypeIndex()}
                >
                </Button>
                {/* Right Arrow */}
                <Button
                    top={380}
                    left={600}
                    height={20}
                    width={20}
                    opacity={1}
                    fontTop={17}
                    fontLeft={5}
                    contents=">"
                    pressedLayout="#222034"
                    unpressedLayout="#3f3f74"
                    submit={() => this.incrementClassTypeIndex()}
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
                <Button
                    pressedLayout="#A9A9A9"
                    unpressedLayout="#A9A9A9"
                    contents={this.state.spectateToggleContents}
                    top="480"
                    left="500"
                    fontTop={17}
                    fontLeft={5}
                    width="15" 
                    height="15"
                    opacity="0.5"
                    submit={() => this.toggleSpectate()}
                />
                {/* Button text */}
                <Text top="545" left="525" contents={this.state.playSpectateButtonContents}></Text>
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