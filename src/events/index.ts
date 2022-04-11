import fs from 'fs';
import path from 'path';

const startListeningEvents = () => {
    const ignoreFiles = ['index.ts'];
    fs.readdirSync(path.resolve(`${__dirname}`))
        .filter(file => file.match(/(.+?)(\.ts|\.js)$/g)?.length && !ignoreFiles.some(ignoreFile => ignoreFile.split('.')[0] === file.split('.')[0]))
        .forEach(file => require(`./${file}`).default());
}

export default startListeningEvents;