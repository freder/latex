I wrote my thesis like this: markdown, with the occasional latex command sprinkled in. it's weird but it works.

features:
- `TODO: asdf` comments as marginalia
- basic stats:
    - % of required character count
- git commit hash as document version


## config
- `config.js`
- `compile-content.js`
    - see `structure` variable
- `templates/make.sh`
    - to change the output path / file name
- `templates/template.tex`
    - to change title, name, etc.


## run

```
cd template
./make.sh
```


## note
- reported character count will include latex commands in .md files
- reported character count ignores abstract.md