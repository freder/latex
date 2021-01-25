const path = require('path');


const contentMdFile = path.join(__dirname, './content.md');
const abstractCompiledMdFile = path.join(__dirname, './abstract-compiled.md');

const contentTexFile = path.join(__dirname, './template/content.tex');
const contentPlainFile = path.join(__dirname, 'content-plain.txt');

const abstractTexFile = path.join(__dirname, './template/abstract.tex');
const abstractPlainFile = path.join(__dirname, 'abstract-plain.txt');


module.exports = {
	contentMdFile,
	abstractCompiledMdFile,
	contentTexFile,
	contentPlainFile,
	abstractTexFile,
	abstractPlainFile,
};
