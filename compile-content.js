const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const R = require('ramda');
const glob = require('glob');

const {
	mode,
	chaptersDir,
	targetCharCount,
	abstractFileName
} = require('./config.js');


const contentMdFile = path.join(__dirname, './content.md');
const contentTexFile = path.join(__dirname, './template/content.tex');
const abstractCompiledMdFile = path.join(__dirname, './abstract-compiled.md');


const pathFromName = (fileName) => {
	return path.join(__dirname, chaptersDir, fileName);
};


let seenFiles = [];
const read = (fileName) => {
	seenFiles = [...seenFiles, fileName];
	return fs.readFileSync(pathFromName(fileName))
		.toString()
		// convert ' / ' to '/', but with a very thin space before and after
		.replace(/ \/ /igm, '\\hspace{0.1em}/\\hspace{0.1em}');
};


const getUnusedFiles = (allFiles, seenFiles) => {
	return R.without(seenFiles, allFiles);
};


const processLatex = (content) => {
	if (mode === 'development') {
		// turn TODO comments into marginalia
		content = content.replace(
			/<!-- TODO: (.*) -->/igm,
`\\marginnote{
	\\color{blue}\\scriptsize
	$1
}`
		);			
	}
	return content;
};


const structure = [
	'\\chapter{Structure}',
	read('structure.md'),

	// -----------------------------------------
	'\\clearpage',
	'\\chapter{Chapter} \\label{chap:chapter-one}',
	read('chapter.md'),

	// -----------------------------------------
	'\\clearpage',
	'\\chapter{Conclusion} \\label{chap:conclusion}',
	read('conclusion.md'),
];

// combine everything in one markdown file:
let content = processLatex(
	structure.join('\n\n')
);
fs.writeFileSync(contentMdFile, content);

// warn about unused files:
const allFiles = glob.sync(pathFromName('*.md'))
	.map((filePath) => path.basename(filePath));
const unusedFiles = getUnusedFiles(allFiles, seenFiles)
	.filter((file) => file !== abstractFileName);
if (unusedFiles.length) {
	console.log('[WARNING] unused files:');
	unusedFiles.forEach((f) => console.log(`- ${f}`));
}

// handle abstract separately because it has to be inserted
// at a different point in the latex template
fs.writeFileSync(abstractCompiledMdFile, read(abstractFileName));
