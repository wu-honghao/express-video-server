const fs = require('fs');
const { promisify } = require('util');
// fs.readFile() promise化
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

exports.getDb = async () => {
    return JSON.parse(await readFile('./db.json', 'utf-8'));
};

exports.serveDb = async data => {
    return await writeFile('./db.json', JSON.stringify(data));
};
