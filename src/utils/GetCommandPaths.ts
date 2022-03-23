import fs from 'fs';

const ignoreFiles = ['index.ts'];

export const GetCommandPaths = (dir: string, returnWithInitialPath = './') => {
    const getPaths = (path: string, paths: string[]) => {
         fs.readdirSync(path).forEach(file => {
            if(fs.lstatSync(`${path}/${file}`).isFile() && !ignoreFiles.some(ignoreFile => ignoreFile === file)) paths.push(`${path}/${file}`);
            if(fs.lstatSync(`${path}/${file}`).isDirectory()) return getPaths(`${path}/${file}`, paths);
        }) ;
        return paths;
    }
    return getPaths(dir, []).map(path => `${returnWithInitialPath}${path.split('/').slice(2).join('/')}`);
}