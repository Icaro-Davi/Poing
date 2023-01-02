import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';

const homedir = os.homedir();

function createFile({ initialData, dir, fileName }: { dir: string; fileName: string; initialData: string; }): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(`${dir}/${fileName}`);
        (!fs.existsSync(dir)) && fs.mkdirSync(dir);
        if (!fs.existsSync(filePath)) {
            fs.writeFile(filePath, initialData, (err => {
                if (err) reject(`Failed create file \n ${err.message}`);
                else resolve(true);
                console.log('created');
            }));
        } else {
            resolve(true);
        };
    });
}

export async function createErrorLog({ errorMessage }: { errorMessage: string}) {
    try {
        const ErrorMessage = `\n[${new Date().toISOString()}] ${errorMessage}`;
        const fileLogsPath = path.resolve(`${homedir}/poing`);
        const fileName = 'poing_bot_error.log';

        if (await createFile({ fileName, dir: fileLogsPath, initialData: '== Error logs from poing-bot application ==' })) {
            fs.appendFileSync(path.resolve(`${fileLogsPath}/${fileName}`), ErrorMessage);
        }
    } catch (error) {
        console.error('[ERROR_CREATE_ERROR_LOGS] Failed to create Logs \n', error);
    }
}