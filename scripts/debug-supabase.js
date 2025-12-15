const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL_DATA;

const client = new Client({
    connectionString: connectionString,
});

async function checkTables() {
    console.log(`🔌 Connecting to DB...`);
    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log("✅ Tables found:", res.rows.map(r => r.table_name));
        await client.end();
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

checkTables();
