/**
 * Sprite component.
 */
 export interface SpriteComponent {
    url: string,
    pixelRatio: number,
}

export function setSprite(url: string, pixelRatio?: number): SpriteComponent {
    let sprite: SpriteComponent = { url: url, pixelRatio: 1 }

    if (pixelRatio)
        sprite.pixelRatio = pixelRatio

    return sprite

}
