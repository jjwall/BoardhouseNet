import { createTextMesh, TextMeshParams } from "../clientengine/clientutils";
import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { Client } from "../clientengine/client";

export interface StatusComponent {
    // name: string; // Name won't change - unnecessary to keep reference.
    level: number;
    maxHp: number;
    currentHp: number;
    levelTextMesh: Mesh;
    levelTextShadowMesh: Mesh;
    levelFontUrl: string;
    levelFontSize: number;
    hpBarMesh: Mesh;
    // maxMp: number; // Not displaying Mp in status currently.
    // currentMp: number; // Not displaying Mp in status currently.
    // maxXp: number; // Not displaying Xp in status currently.
    // currentXp: number; // Not displaying Xp in status currently.
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

export function setStatusComponentAndGraphic(client: Client, entMesh: Mesh, statusData: StatusData): StatusComponent {
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
    // Player name text shadow.
    const playerNameOffsetX = 0;
    const playerNameOffsetY = 7;
    const playerNameTextShadowMeshParams: TextMeshParams = {
        contents: statusData.name,
        color: "#000000",
    }
    const playerNameTextShadowMesh = createTextMesh(client, playerNameTextShadowMeshParams);
    playerNameTextShadowMesh.position.x += playerNameOffsetX + statusData.offsetX - 1;
    playerNameTextShadowMesh.position.y += playerNameOffsetY + statusData.offsetY - 1;
    // Player name text.
    const playerNameTextMeshParams: TextMeshParams = {
        contents: statusData.name,
        color: "#FFFFFF",
    }
    const playerNameTextMesh = createTextMesh(client, playerNameTextMeshParams);
    playerNameTextMesh.position.x += playerNameOffsetX + statusData.offsetX;
    playerNameTextMesh.position.y += playerNameOffsetY + statusData.offsetY;
    // Level text shadow.
    const levelTextOffsetX = 0;
    const levelTextOffsetY = 22;
    const levelTextShadowMeshParams: TextMeshParams = {
        contents: `Lv: ${statusData.level}`,
        color: "#000000",
        fontSize: 9,
    }
    const levelTextShadowMesh = createTextMesh(client, levelTextShadowMeshParams);
    levelTextShadowMesh.position.x += levelTextOffsetX + statusData.offsetX - 1;
    levelTextShadowMesh.position.y += levelTextOffsetY + statusData.offsetY - 1;
    // Level text.
    const levelTextMeshParams = {
        contents: `Lv: ${statusData.level}`,
        color: "#FFFFFF",
        fontSize: 9,
    }
    const levelTextMesh = createTextMesh(client, levelTextMeshParams);
    levelTextMesh.position.x += levelTextOffsetX + statusData.offsetX;
    levelTextMesh.position.y += levelTextOffsetY + statusData.offsetY;
    // Add to group.
    const container = new Group();
    entMesh.add(container);
    container.add(hpBar);
    container.add(hpBaseBar);
    container.add(levelTextShadowMesh);
    container.add(levelTextMesh);
    container.add(playerNameTextShadowMesh);
    container.add(playerNameTextMesh);

    return { 
        level: statusData.level,
        maxHp: statusData.maxHp,
        currentHp: statusData.currentHp,
        levelTextMesh: levelTextMesh,
        levelTextShadowMesh: levelTextShadowMesh,
        levelFontSize: 9,
        levelFontUrl: "./assets/fonts/helvetiker_regular_typeface.json",
        hpBarMesh: hpBar,
    }
}