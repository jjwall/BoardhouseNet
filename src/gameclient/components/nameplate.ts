import { createTextMesh, TextMeshParams } from "../clientengine/clientutils";
import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { StatsData } from "../../packets/data/statsdata";
import { Client } from "../clientengine/client";

export interface NameplateComponent {
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
    // maxMp: number; // Not displaying Mp in nameplate currently.
    // currentMp: number; // Not displaying Mp in nameplate currently.
    // maxXp: number; // Not displaying Xp in nameplate currently.
    // currentXp: number; // Not displaying Xp in nameplate currently.
}

export function setNameplateComponent(client: Client, entMesh: Mesh, statsData: StatsData): NameplateComponent {
    // HP Base Bar.
    const hpBaseBarWidth = statsData.width + 4;
    const hpBaseBarHeight = statsData.height + 4;
    const hpBaseBarGeom = new PlaneGeometry(hpBaseBarWidth, hpBaseBarHeight);
    const hpBaseBarMaterial = new MeshBasicMaterial({ color: "#282828", opacity: 0.75, transparent: true });
    const hpBaseBar = new Mesh(hpBaseBarGeom, hpBaseBarMaterial);
    hpBaseBar.geometry.translate(hpBaseBarWidth/2, -hpBaseBarHeight/2, 0);
    hpBaseBar.position.z += 2;
    hpBaseBar.position.x += statsData.offsetX - 2;
    hpBaseBar.position.y += statsData.offsetY + 2;
    // HP Bar.
    const maxHpBarWidth = statsData.width;
    const hpBarHeight = statsData.height;
    // Initialize size of hp bar based on current hp.
    const hpBarGeom = new PlaneGeometry((statsData.currentHp / statsData.maxHp) * maxHpBarWidth, hpBarHeight);
    const hpBarMaterial = new MeshBasicMaterial({ color: statsData.hpBarColor });
    const hpBar = new Mesh(hpBarGeom, hpBarMaterial);
    hpBar.geometry.translate(maxHpBarWidth/2, -hpBarHeight/2, 0);
    hpBar.position.z += 3;
    hpBar.position.x += statsData.offsetX;
    hpBar.position.y += statsData.offsetY;
    // Player name text shadow.
    const playerNameOffsetX = 0;
    const playerNameOffsetY = 7;
    const playerNameTextShadowMeshParams: TextMeshParams = {
        contents: statsData.name,
        color: "#000000",
    }
    const playerNameTextShadowMesh = createTextMesh(client, playerNameTextShadowMeshParams);
    playerNameTextShadowMesh.position.z += 2
    playerNameTextShadowMesh.position.x += playerNameOffsetX + statsData.offsetX - 1;
    playerNameTextShadowMesh.position.y += playerNameOffsetY + statsData.offsetY - 1;
    // Player name text.
    const playerNameTextMeshParams: TextMeshParams = {
        contents: statsData.name,
        color: "#FFFFFF",
    }
    const playerNameTextMesh = createTextMesh(client, playerNameTextMeshParams);
    playerNameTextMesh.position.z += 2
    playerNameTextMesh.position.x += playerNameOffsetX + statsData.offsetX;
    playerNameTextMesh.position.y += playerNameOffsetY + statsData.offsetY;
    // Level text shadow.
    const levelTextOffsetX = 0;
    const levelTextOffsetY = 22;
    const levelTextShadowMeshParams: TextMeshParams = {
        contents: `Lv: ${statsData.level}`,
        color: "#000000",
        fontSize: 9,
    }
    const levelTextShadowMesh = createTextMesh(client, levelTextShadowMeshParams);
    levelTextShadowMesh.position.z += 2
    levelTextShadowMesh.position.x += levelTextOffsetX + statsData.offsetX - 1;
    levelTextShadowMesh.position.y += levelTextOffsetY + statsData.offsetY - 1;
    // Level text.
    const levelTextMeshParams = {
        contents: `Lv: ${statsData.level}`,
        color: "#FFFFFF",
        fontSize: 9,
    }
    const levelTextMesh = createTextMesh(client, levelTextMeshParams);
    levelTextMesh.position.z += 2
    levelTextMesh.position.x += levelTextOffsetX + statsData.offsetX;
    levelTextMesh.position.y += levelTextOffsetY + statsData.offsetY;
    // Add to group.
    const container = new Group();
    entMesh.add(container);
    container.add(hpBaseBar);
    container.add(hpBar);
    container.add(levelTextShadowMesh);
    container.add(levelTextMesh);
    container.add(playerNameTextShadowMesh);
    container.add(playerNameTextMesh);

    // Return Nameplate Component.
    return { 
        maxHp: statsData.maxHp,
        currentHp: statsData.currentHp,
        maxHpBarWidth: statsData.width,
        hpBarHeight: statsData.height,
        hpBarMesh: hpBar,
        level: statsData.level,
        levelTextMesh: levelTextMesh,
        levelTextShadowMesh: levelTextShadowMesh,
        levelFontSize: 9,
        levelFontUrl: "./assets/fonts/helvetiker_regular_typeface.json",
    }
}