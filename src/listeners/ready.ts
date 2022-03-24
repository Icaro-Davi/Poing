import fs from 'fs';
import { searchCommandsFiles } from "../utils/commands";

const onReady = () => {
    console.log('\n\n',fs.readFileSync('./draw').toString())
    console.log(`\n\n\n-- I'm listening all :3`);
    console.log('--- Prefix:', process.env.BOT_DEFAULT_PREFIX);
    console.log('--- Bot Name:', process.env.BOT_NAME);
    console.log('--- Loaded Commands:', searchCommandsFiles('./src/commands'));
    console.log(`-- My creator is https://github.com/icaro-davi`);
}

export default onReady;