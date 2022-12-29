// /** @jsx createJSXElement */
import { createJSXElement } from "./../../../ui/createjsxelement";
import { JSXElement, ComponentInstance } from "./../../../ui/interfaces";
import { renderWidget } from "./../../../ui/renderwidget";
import { Scene } from "THREE";
import { Widget } from "./../../../ui/widget";
import { Component } from "./../../../ui/component";
import { TouchControlButton } from "./../../../ui/corecomponents/touchcontrolbutton";
import { TouchControls } from "./touchcontrols";
import { FPS } from "../../../ui/corecomponents/fps";
import { InputBox } from "../../../ui/corecomponents/inputbox";
import { Button } from "../../corecomponents/button";

export function renderGamePlayUi(scene: Scene, rootWidget: Widget, props: Props): Root {
    let rootInstance = renderWidget(<Root { ...props }/>, rootWidget, scene);

    return rootInstance.component as Root;
}


interface Props {
    // name: string;
    // initial_state: object
    addClicks: Function,
    // displayFPS: boolean;
    // leftPress: () => void;
    // leftUnpress: () => void;
    // rightPress: () => void;
    // rightUnpress: () => void;
    // upPress: () => void;
    // upUnpress: () => void;
    // downPress: () => void;
    // downUnpress: () => void;
}

interface State {
    ticks: number;
    clicks: number;
    color: string;
    hidden: boolean;
    currentFPS: number;
}

export class Root extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
            currentFPS: 0,
            ticks: 50,
            clicks: 0,
            color: "#00FFFF",
            hidden: false,
        };

        setInterval(() => this.tick(), 1000);
    }

    public addClick = (): void => {
        if (!!this.props.addClicks) {
            this.props.addClicks();
        }
    }

    public setClicks = (clicks: number) => {
        this.setState({
            clicks: clicks
        });
    }

    public tick = (): void => {
        this.setState({
            ticks: this.state.ticks + 1
        });
    }

    public updateFPS = (currentFPS: number): void => {
        this.setState({
            currentFPS: currentFPS
        });
    }

    public toggle = (): void => {
        if (this.state.hidden) {
            this.setState({
                hidden: false
            });
        }
        else {
            this.setState({
                hidden: true
            });
        }
    }

    render(): JSXElement {
        return(
            // <Test ticks = {this.state.ticks}
            //     clicks = {this.state.clicks}
            //     color = {this.state.color}
            //     hidden = {this.state.hidden}
            //     press = {this.press}
            //     unpress = {this.unpress}
            //     addClick = {this.addClick}
            //     toggle = {this.toggle}>
            // </Test>
            <panel>
                {/* <FPS 
                    displayFPS={this.props.displayFPS}
                    currentFPS={this.state.currentFPS}
                ></FPS> */}
                <TouchControls
                    top="250"
                    left="50"
                    upPress={() => undefined}
                    upUnpress={() => undefined}
                    leftPress={() => undefined}
                    leftUnpress={() => undefined}
                    rightPress={() => undefined}
                    rightUnpress={() => undefined}
                    downPress={() => undefined}
                    downUnpress={() => undefined}
                />
                <InputBox
                    focusColor="#FFFFFF"
                    blurColor="#C9CFFF"
                    borderColor="#000000"
                    top="200"
                    left="200"
                    width={100}
                    height={50}
                    submit={()=>{}}
                />
                <Button
                    // pressedLayout="./data/textures/icons/d17.png"
                    // unpressedLayout="./data/textures/icons/d17.png"
                    pressedLayout="#FFFFFF"
                    unpressedLayout="#C9CFFF"
                    height={64}
                    width={64}
                    top="650"
                    left="1000"
                    submit={() => console.log('hello button')}
                ></Button>
                <panel height="64" width="64" left="1000" top="650" color="#00FFFF" img="./data/textures/icons/d17.png" onClick={()=> console.log('hello button 2')}>
                    {/* <label z_index="2" top="10" color="#FF0000" contents={this.props.clicks.toString()}></label> */}
                </panel>
                {/* <panel height="70" width="300" color="#228B22" top="250" left="500" >
                    <panel z_index="1" height="50" width="50" color="#0077FF" img="./data/textures/cottage.png">
                        <label z_index="2" top="10" color="#0000FF" contents={this.props.ticks.toString()}></label>
                    </panel>
                    <panel left="-100" height="50" width="50" img="./data/textures/cottage.png">
                        onPress={() => this.props.press()}
                        onUnpress={() => this.props.unpress()}
                        onSubmit={() => this.props.toggle()}>
                    </panel>
                    <panel left="100" height="50" width="50" color="#00FFFF" img="./data/textures/cottage.png" onClick={()=> console.log('hello button 2')}>
                        <label z_index="2" top="10" color="#FF0000" contents={this.props.clicks.toString()}></label>
                    </panel>
                </panel> */}
            </panel>
        )
    }
}