const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const iconPath = path.resolve('d:/dev/learn-eng/eng-notebook/src/app/icon.png');

if (fs.existsSync(iconPath)) {
    fs.createReadStream(iconPath)
        .pipe(new PNG())
        .on('parsed', function () {
            const width = this.width;
            const height = this.height;
            console.log(`Dimensions: ${width}x${height}`);

            // Check corners
            const corners = [
                { x: 0, y: 0, name: 'Top-Left' },
                { x: width - 1, y: 0, name: 'Top-Right' },
                { x: 0, y: height - 1, name: 'Bottom-Left' },
                { x: width - 1, y: height - 1, name: 'Bottom-Right' }
            ];

            let hasWhiteBackground = false;

            corners.forEach(corner => {
                const idx = (width * corner.y + corner.x) << 2;
                const r = this.data[idx];
                const g = this.data[idx + 1];
                const b = this.data[idx + 2];
                const a = this.data[idx + 3];
                console.log(`${corner.name}: RGBA(${r}, ${g}, ${b}, ${a})`);

                if (a === 255 && r > 240 && g > 240 && b > 240) {
                    hasWhiteBackground = true;
                }
            });

            if (hasWhiteBackground) {
                console.log("CONCLUSION: The icon HAS a white background (at least in the corners).");
            } else {
                console.log("CONCLUSION: The corners are NOT white (might be transparent or another color).");
            }
        })
        .on('error', (err) => console.error("Error parsing PNG:", err));
} else {
    console.error("icon.png not found!");
}
