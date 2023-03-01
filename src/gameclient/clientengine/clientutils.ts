import { Mesh, MeshBasicMaterial } from "three";
import { Client } from "./client";

export interface TextMeshParams {
    color?: string;
    fontUrl?: string;
    fontSize?: number;
    contents?: string;
}

export function createTextMesh(client: Client, params: TextMeshParams): Mesh {
    const color = params?.color || "#000000";
    const fontUrl = params?.fontUrl || "./assets/fonts/helvetiker_regular_typeface.json";
    const fontSize = params?.fontSize || 12;
    const contents = params?.contents || "";
    const geom = client.getTextGeometry(contents, fontUrl, fontSize);
    const material = new MeshBasicMaterial({
        color: color,
        transparent: true,
    });

    return new Mesh(geom, material);
}