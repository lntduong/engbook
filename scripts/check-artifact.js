const fs = require('fs');
const path = require('path');

const artifactPath = path.resolve('C:/Users/lntdu/.gemini/antigravity/brain/42cf196f-4588-4b55-81de-6b224d3bc680/engbook_icon_fresh_1765792251724.png');

if (fs.existsSync(artifactPath)) {
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(artifactPath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    console.log('Artifact Hex Header:', buffer.toString('hex'));

    const pngSignature = '89504e470d0a1a0a';
    if (buffer.toString('hex') === pngSignature) {
        console.log('Artifact IS a valid PNG.');
    } else {
        console.log('Artifact is NOT a valid PNG.');
    }
} else {
    console.log('Artifact file not found.');
}
