// /** @jsx createJSXElement */
import { createJSXElement } from "./../../ui/core/createjsxelement";
import { JSXElement } from "./../../ui/core/interfaces";
import { Scene } from "THREE";
import { Component } from "../core/component";

interface Props {
    displayFPS: boolean;
    currentFPS: number;
}

export class FPS extends Component<Props, {}> {
    constructor(props: Props, scene: Scene) {
        super(props, scene);
    }
    
    render(): JSXElement {
        if (this.props.displayFPS) {
            return (
                <panel top="60" left="125"> 
                    <label 
                        contents={`FPS: ${this.props.currentFPS.toString()}`}
                        color="#0000FF"
                        font_size="50">
                    </label>
                </panel>
            );
        }
        else
            return <panel/>;
    }
}