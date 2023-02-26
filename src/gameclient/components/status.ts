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
    // height: number;
    // width: number;
    // offsetX: number;
    // offsetY: number;
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
    hpBarColor: string;
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
}

export function setStatusGraphic(entMesh: Mesh, statusData: StatusData) {
    // HP Base Bar.
    const hpBaseBarWidth = statusData.width + 4;
    const hpBaseBarHeight = statusData.height + 4;
    const hpBaseBarGeom = new PlaneGeometry(hpBaseBarWidth, hpBaseBarHeight);
    const hpBaseBarMaterial = new MeshBasicMaterial({ color: "#282828", opacity: 0.75, transparent: true });
    hpBaseBarGeom.translate(hpBaseBarWidth/2, -hpBaseBarHeight/2, 0);
    const hpBaseBar = new Mesh(hpBaseBarGeom, hpBaseBarMaterial);
    hpBaseBar.position.z += 1;
    hpBaseBar.position.x += statusData.offsetX - 2;
    hpBaseBar.position.y += statusData.offsetY + 2;
    // HP Bar.
    const hpBarWidth = statusData.width;
    const hpBarHeight = statusData.height;
    const hpBarGeom = new PlaneGeometry(hpBarWidth, hpBarHeight);
    const hpBarMaterial = new MeshBasicMaterial({ color: statusData.hpBarColor });
    hpBarGeom.translate(hpBarWidth/2, -hpBarHeight/2, 0);
    const hpBar = new Mesh(hpBarGeom, hpBarMaterial);
    hpBar.position.z += 2;
    hpBar.position.x += statusData.offsetX;
    hpBar.position.y += statusData.offsetY;
    
    const container = new Group();
    entMesh.add(container);
    container.add(hpBar);
    container.add(hpBaseBar);
}