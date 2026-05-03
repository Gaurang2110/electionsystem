const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const files = ['bn.json', 'gu.json', 'hi.json', 'mr.json', 'ta.json', 'te.json'];

function getKeys(obj, prefix = '') {
    let keys = [];
    for (let key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

const enKeys = getKeys(en);

files.forEach(file => {
    const filePath = path.join('messages', file);
    if (!fs.existsSync(filePath)) {
        console.log(`File ${file} does not exist.`);
        return;
    }
    const target = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const targetKeys = getKeys(target);
    const missing = enKeys.filter(k => !targetKeys.includes(k));
    console.log(`--- ${file} ---`);
    console.log(`Missing: ${missing.length} keys`);
    missing.forEach(k => console.log(`  ${k}`));
});
