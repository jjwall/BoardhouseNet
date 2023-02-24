/**
 * Script to generate animation sequence data for use in animationdata.ts files.
 * Written for Node.
 */

/**
 * An example command would be: 
 * ``node animdatagen.js data/textures/ranger/idle/Ranger_idle 15 3 true``
 * @param {*} baseTextureName process.argv[2] should contain the base name of your texture i.e. "assets/textures/ranger/idle/Ranger_idle"
 * @param {*} frames process.argv[3] should contain the number of frames you want to generate
 * @param {*} ticks process.argv[4] should contain the number of ticks each frame should be set with
 * @param {*} loop defaults to true if not set
 */
function generateTextureUrls({ baseTextureName, frames, ticks, loop }) {
    if (!baseTextureName)
        console.log(`
* @param {*} baseTextureName process.argv[2] should contain the base name of your texture i.e. "assets/textures/ranger/idle/Ranger_idle"
* @param {*} frames process.argv[3] should contain the number of frames you want to generate
* @param {*} ticks process.argv[4] should contain the number of ticks each frame should be set with
* @param {*} loop defaults to true if not set
        `)
    else {
        for (var i = 0; i <= frames; i++) {
            let currentFrame = "0"
            let nextFrame = 0

            if (i < 10)
                currentFrame += i.toString()
            else
                currentFrame = i.toString()

            if (i != frames){
                nextFrame = i + 1
            } else {
                if (loop === true)
                    nextFrame = 0

                if (loop == 'false')
                    nextFrame = i
            }

            console.log(`{`)
            console.log(`    ticks: ${ticks},`)
            console.log(`    texture: "${baseTextureName}_${currentFrame}.png",`),
            console.log(`    nextFrame: ${nextFrame}`)
            console.log(`},`)
        }
    }
}

const arguments = {
    baseTextureName: process.argv[2],
    frames: process.argv[3],
    ticks: process.argv[4],
    loop: process.argv[5]
}

generateTextureUrls(arguments)