import { Entity } from "./entity";

import { Vector3 } from "three";
export function last<T>(array: T[]) : T {
    return array[array.length - 1];
}

export function getWorldPosition(ent: Readonly<Entity>): Vector3 {
    const pos = new Vector3(ent.pos.loc.x, ent.pos.loc.y, ent.pos.loc.z);

    const getParent = (e: Readonly<Entity>) => {
        if (!e.parent) return null;
        return e.parent;
    };

    let ancestor = getParent(ent);

    while (ancestor) {
        pos.add(ancestor.pos.loc);
        ancestor = getParent(ancestor);
    }

    return pos;
}