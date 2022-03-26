import fs from 'fs';

const startListeningEvents = () => {
    const ignoreFiles = ['index.ts'];
    fs.readdirSync('./src/listeners')
        .filter(file => file.endsWith('.ts') && !ignoreFiles.some(ignoreFile => ignoreFile === file))
        .forEach(file => require(`./${file}`).default())
}

export default startListeningEvents;