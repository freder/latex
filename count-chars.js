const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const { targetCharCount } = require('./config.js');


const contentTexFile = path.join(__dirname, './template/content.tex');
const contentPlainFile = path.join(__dirname, 'content-plain.txt');

const abstractTexFile = path.join(__dirname, './template/abstract.tex');
const abstractPlainFile = path.join(__dirname, 'abstract-plain.txt');

// convert to plain text
child_process.execSync(`pandoc ${contentTexFile} -t plain -o ${contentPlainFile}`);
child_process.execSync(`pandoc ${abstractTexFile} -t plain -o ${abstractPlainFile}`);

const contentCount = fs.readFileSync(contentPlainFile).toString().length;
const abstractCount = fs.readFileSync(abstractPlainFile).toString().length;
const charCount = contentCount + abstractCount;

console.log('');
console.log('INFO:');

const percent = (100 * charCount / targetCharCount).toFixed(2);
console.log(charCount, '/', targetCharCount, `(${percent}%)`);
