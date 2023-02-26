import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export interface StatusComponent {
    // Data fields.
    name: string;
    level: number;
    maxHp: number;
    currentHp: number;
    maxMp: number;
    currentMp: number;
    maxXp: number;
    currentXp: number;
    // Graphic fields.
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
    // statusPlate: Group
}

type StatusData = {
    // Data fields.
    name: string;
    level: number;
    maxHp: number;
    currentHp: number;
    maxMp: number;
    currentMp: number;
    maxXp: number;
    currentXp: number;
    // Graphic fields.
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
}

export function setStatusGraphic(entMesh: Mesh, statusData: StatusData) {
    const hpBarWidth = statusData.width
    const hpBarHeight = statusData.height
    const hpBarGeom = new PlaneGeometry(hpBarWidth, hpBarHeight);
    const hpBarMaterial = new MeshBasicMaterial( { color: '#c9424a' });
    hpBarGeom.translate(hpBarWidth/2, -hpBarHeight/2, 0);
    const hpBar = new Mesh(hpBarGeom, hpBarMaterial);
    hpBar.position.z += 1
    hpBar.position.x += statusData.offsetX
    hpBar.position.y += statusData.offsetY
    const container = new Group();
    entMesh.add(container);
    container.add(hpBar);
}