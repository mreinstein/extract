import PNG from 'pngjs3'
import fs  from 'fs'


// determine the rectangular dimensions that encapsulates all
// non-transparent pixels in a .png file
async function getDimensions (filepath) {
    return new Promise(function (resolve, reject) {
        fs.createReadStream(filepath)
        .pipe(new PNG({
            filterType: 4
        }))
        .on('parsed', function () {

            let minX, minY, maxX, maxY

            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    const idx = (this.width * y + x) << 2;

                    if (this.data[idx]) {
                        if (minX === undefined || x < minX)
                            minX = x

                        if (minY === undefined || y < minY)
                            minY = y

                        if(maxX === undefined || x > maxX)
                            maxX = x

                        if (maxY === undefined || y > maxY)
                            maxY = y
                    }
                }
            }

            resolve({ minX, minY, maxX, maxY })
        })
    })
}

// get the rectangle encapsulating all tiles in the Layer
export default async function extractDimensions (basePath, prefix, length) {
    let minX, minY, maxX, maxY

    for (let tile=0; tile < length; tile++) {
        const i = tile < 10 ? '0' + tile : tile
        let tileDimensions = await getDimensions(`${basePath}/${prefix}${i}.png`)

        if (tileDimensions.minX === undefined)
            continue  // ignore tiles that have no bounding box (all transparent pixels)

        if (minX === undefined || tileDimensions.minX < minX)
            minX = tileDimensions.minX

        if (minY === undefined || tileDimensions.minY < minY)
            minY = tileDimensions.minY

        if (maxX === undefined || tileDimensions.maxX > maxX)
            maxX = tileDimensions.maxX

        if (maxY === undefined || tileDimensions.maxY > maxY)
            maxY = tileDimensions.maxY
    }

    if (minX === undefined)
        return

    return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}
