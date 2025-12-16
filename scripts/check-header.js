const fs = require('fs');
const path = require('path');

const iconPath = path.resolve('d:/dev/learn-eng/eng-notebook/src/app/icon.png');

if (fs.existsSync(iconPath)) {
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(iconPath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    console.log('Hex Header:', buffer.toString('hex'));

    const pngSignature = '89504e470d0a1a0a';
    if (buffer.toString('hex') === pngSignature) {
        console.log('File has valid PNG signature.');
    } else {
        console.log('File does NOT have a valid PNG signature.');
    }
} else {
    console.log('File not found.');
}
