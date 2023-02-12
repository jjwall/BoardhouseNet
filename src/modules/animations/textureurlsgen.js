/**
 * Script to generate texture urls for use in texture loading.
 * Written for Node.
 */

/**
 * An example command would be: 
 * ``node textureurlsgen.js data/textures/ranger/idle/Ranger_idle 15``
 * @param {*} baseTextureName process.argv[2] should contain the base name of your texture i.e. "data/textures/ranger/idle/Ranger_idle"
 * @param {*} frames process.argv[3] should contain the number of frames you want to generate
 */
function generateTextureUrls({ baseTextureName, frames }) {
    for (var i = 0; i <= frames; i++) {
        let currentFrame = "0"

        if (i < 10)
            currentFrame += i.toString()
        else
            currentFrame = i.toString()

        console.log(`        "${baseTextureName}_${currentFrame}.png",`)
    }
}

const arguments = {
    baseTextureName: process.argv[2],
    frames: process.argv[3],
}

generateTextureUrls(arguments)