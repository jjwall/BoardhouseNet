import { createTextMesh, TextMeshParams } from "../clientengine/clientutils";
import { BufferGeometry, Group, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { Client } from "../clientengine/client";

// TODO: (Done) Hp bar updates.
// TODO: HUD state updates from client entity updates -> use root component . setState
// -> This works fine. But do we want status plate to show for current player?
// TODO: Usernames set in lobby. Default if nothing is chosen is: Player_ClientId
// -> Once done I'm done with UI??
export interface StatusComponent {
    // name: string; // Name won't change - unnecessary to keep reference.
    maxHp: number;
    currentHp: number;
    maxHpBarWidth: number;
    hpBarHeight: number;
    hpBarMesh: Mesh;
    level: number;
    levelTextMesh: Mesh;
    levelTextShadowMesh: Mesh;
    levelFontUrl: string;
    levelFontSize: number;
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
    const hpBaseBar = new Mesh(hpBaseBarGeom, hpBaseBarMaterial);
    hpBaseBar.geometry.translate(hpBaseBarWidth/2, -hpBaseBarHeight/2, 0);
    hpBaseBar.position.z += 1;
    hpBaseBar.position.x += statusData.offsetX - 2;
    hpBaseBar.position.y += statusData.offsetY + 2;
    // HP Bar.
    const maxHpBarWidth = statusData.width;
    const hpBarHeight = statusData.height;
    // Initialize size of hp bar based on current hp.
    const hpBarGeom = new PlaneGeometry((statusData.currentHp / statusData.maxHp) * maxHpBarWidth, hpBarHeight);
    const hpBarMaterial = new MeshBasicMaterial({ color: statusData.hpBarColor });
    const hpBar = new Mesh(hpBarGeom, hpBarMaterial);
    hpBar.geometry.translate(maxHpBarWidth/2, -hpBarHeight/2, 0);
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

    // Return Status Component.
    return { 
        maxHp: statusData.maxHp,
        currentHp: statusData.currentHp,
        maxHpBarWidth: statusData.width,
        hpBarHeight: statusData.height,
        hpBarMesh: hpBar,
        level: statusData.level,
        levelTextMesh: levelTextMesh,
        levelTextShadowMesh: levelTextShadowMesh,
        levelFontSize: 9,
        levelFontUrl: "./assets/fonts/helvetiker_regular_typeface.json",
    }
}