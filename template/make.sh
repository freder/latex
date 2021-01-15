#!/bin/bash
set -e # stop on error

rm -f ../content.md
output=`node ../compile-content.js`

# -----------------------------------

rm -f output/*
rm -f content.tex

# use hash of current commit as document version
git rev-parse --short HEAD > version.tex

/usr/local/bin/pandoc \
	--filter pandoc-crossref \
	--citeproc \
	--biblatex \
	--bibliography=../sources.bib \
	-o abstract.tex \
	../abstract-compiled.md

/usr/local/bin/pandoc \
	--filter pandoc-crossref \
	--citeproc \
	--biblatex \
	--bibliography=../sources.bib \
	-o content.tex \
	../content.md

xelatex template.tex
biber template
xelatex template.tex
xelatex template.tex

mv template.pdf output/thesis.pdf

rm -f *.{aux,bbl,bcf,blg,log,run.xml,out,toc}
# rm -f content.tex

# -----------------------------------

echo -e "$output"
