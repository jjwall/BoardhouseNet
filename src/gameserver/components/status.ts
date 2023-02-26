

/**
 * Status component.
 */
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
    hpBarColor: string;
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
}

export interface StatusParams {
    name: string;
    level: number;
    maxHp: number;
    maxMp: number;
    maxXp: number;
    hpBarColor: string;
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
}

export function setStatus(params: StatusParams): StatusComponent  {
    return {
        name: params.name,
        level: params.level,
        maxHp: params.maxHp,
        currentHp: params.maxHp,
        maxMp: params.maxMp,
        currentMp: params.maxMp,
        maxXp: params.maxXp,
        currentXp: params.maxXp,
        hpBarColor: params.hpBarColor,
        height: params.height,
        width: params.width,
        offsetX: params.offsetX,
        offsetY: params.offsetY,
    }
}