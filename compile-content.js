const fs = require('fs');
const path = require('path');

const R = require('ramda');
const remark = require('remark');
const strip = require('strip-markdown');
const glob = require('glob');

const {
	mode,
	chaptersDir,
	targetCharCount,
	abstractFileName
} = require('./config.js');


const outputFile = './content.md';


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
let content = structure.join('\n\n');

remark()
	.use(strip)
	.process(
		content, (err, plainText) => {
		if (err) { throw err; }

		// save plain text version
		fs.writeFileSync(
			path.join(__dirname, 'content-plain.txt'),
			String(plainText)
		)

		console.log('');
		console.log('INFO:');
		console.log('-----');

		// count characters in plain text version
		const charCount = String(plainText).length;
		const percent = (100 * charCount / targetCharCount).toFixed(2);
		console.log(charCount, '/', targetCharCount, `(${percent}%) without abstract`);

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

		fs.writeFileSync(
			path.join(__dirname, outputFile),
			content
		);

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
		fs.writeFileSync(
			path.join(__dirname, './abstract-compiled.md'),
			read(abstractFileName)
		);
	});
