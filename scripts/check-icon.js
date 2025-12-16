const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const iconPath = path.resolve('d:/dev/learn-eng/eng-notebook/src/app/icon.png');

if (fs.existsSync(iconPath)) {
    fs.createReadStream(iconPath)
        .pipe(new PNG())
        .on('parsed', function () {
            console.log(`Image dimensions: ${this.width}x${this.height}`);
            console.log(`Has alpha channel: ${this.alpha}`);

            // Check corner pixel (0,0) transparency
            const idx = 0; // (0,0)
            console.log(`Pixel (0,0) RGBA: ${this.data[idx]}, ${this.data[idx + 1]}, ${this.data[idx + 2]}, ${this.data[idx + 3]}`);

            if (this.data[idx + 3] === 0) {
                console.log("Corner pixel is TRANSPARENT.");
            } else {
                console.log("Corner pixel is OPAQUE (or semi-transparent).");
            }
        })
        .on('error', (err) => console.error("Error parsing PNG:", err));
} else {
    console.error("icon.png not found!");
}
