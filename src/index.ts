#!/usr/bin/env node
export {JsonPlaceholderReplacer} from './json-placeholder-replacer';
import {JsonPlaceholderReplacer} from './json-placeholder-replacer';
import * as fs from 'fs';

if (process.argv.length > 2 && process.argv[1].includes('jpr')) {
    process.exitCode = process.argv.length;
    const replacer = new JsonPlaceholderReplacer();

    process.argv
        .filter((value: string, index: number) => index > 2)
        .map((value: string) => replacer.addVariableMap(JSON.parse(fs.readFileSync(value).toString())));

    const replaceableFileContent = fs.readFileSync(process.argv[2]).toString();
    const replacedValue = replacer.replace(replaceableFileContent);
    console.log('INFO: Writing replaced value into replaceable file')
    fs.writeFileSync(process.argv[2], JSON.stringify(replacedValue, null, 2));
    console.log('INFO: Replace Done!')
    process.exitCode = 0;
}
