/** Interface for stats and stats display data. */
export interface StatsData {
    name: string;
    level: number;
    maxHp: number;
    currentHp: number;
    maxMp: number;
    currentMp: number;
    maxXp: number;
    currentXp: number;
    hpBarColor: string;
    height: number;
    width: number;
    offsetX: number;
    offsetY: number;
}