// Script to generate correct bcrypt hashes for passwords
// Run this with: node generate-hash.js

const bcrypt = require('bcryptjs');

async function generateHashes() {
    console.log('Generating bcrypt hashes...\n');

    // Admin password: admin123
    const adminHash = await bcrypt.hash('admin123', 10);
    console.log('Admin password (admin123):');
    console.log(adminHash);
    console.log('');

    // User password: user123
    const userHash = await bcrypt.hash('user123', 10);
    console.log('User password (user123):');
    console.log(userHash);
    console.log('');

    // Verify they work
    const adminValid = await bcrypt.compare('admin123', adminHash);
    const userValid = await bcrypt.compare('user123', userHash);

    console.log('Verification:');
    console.log('Admin hash valid:', adminValid);
    console.log('User hash valid:', userValid);
}

generateHashes().catch(console.error);
