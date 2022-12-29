import { createJSXElement } from "./../../createjsxelement";
import { JSXElement } from "./../../interfaces";
import { Scene, Vector3 } from "three";
import { Component } from "./../../component";
import { DraggableWidget } from "../../corecomponents/draggablewidget";

// TODO: Have items "snap" to empty inventory space if moving items around via drag and drop
// TODO: Implement Equipment Screen that enables armor and skill / weapon equips via drag and drop from inventory
// TODO: Create data or "conext" or "global state" layer that carries client item data
// -> Example: We have 8 inventory slots, client should be aware of what item is occupying which spot so
// we know what to render in the inventory on scene load. (consider on enter game and scene transition ramifications)
// -> Consider refactoring "data" directory at root to be named "assets". This would be a big refactor!
// TODO: Enable ability to hide / show Inventory via hotkey or clickable UI button on screen
// -> Vision for this was a little bag that would animate a moving animation of bag coming from off screen on bottom
// -> If we take this route, investigate UI animations (shouldn't be too hard with a little for loop async method on component)
// TODO: Create item "drops" akin to MapleStory where you have to be near it and then press "Z" or something and it 
// picks up the item and stores it in your inventory. Red warning message displays at top if inventory is full.
// -> Test cases can include current coded actions: sword, bow, magic fireball spell
interface Props {
    top: string | number
    left: string | number
}

/**
 * Todo: Test Inventory coming on / off screen.
 */
interface State {
    // top: number
    // left: number
}

export class Inventory extends Component<Props, State> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
        this.state = {
        }
    }

    render(): JSXElement {
        return (
            <panel left={this.props.left} top={this.props.top} height="143" width="281" color="#282828">
                <panel left="5" top ="5" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="74" top ="5" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="143" top ="5" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="212" top ="5" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="5" top ="74" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="74" top ="74" height="64" width="64" color="#A9A9A9">
                    <DraggableWidget
                        pressedLayout="./data/textures/icons/d49.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    />
                </panel>
                <panel left="143" top ="74" height="64" width="64" color="#A9A9A9">
                    {/* <DraggableWidget
                        pressedLayout="./data/textures/icons/d17.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    /> */}
                </panel>
                <panel left="212" top ="74" height="64" width="64" color="#A9A9A9">
                    {/* <DraggableWidget
                        pressedLayout="./data/textures/icons/d17.png"
                        unpressedLayout="./data/textures/icons/d17.png"
                        height="64"
                        width="64"
                        top="0"
                        left="0"
                    /> */}
                </panel>
            </panel>
        )
    }
}
