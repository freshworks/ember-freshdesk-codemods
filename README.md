# ember-codemods


A collection of codemod's for ember-codemods.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-codemods <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-codemods
ember-codemods <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [insert-hooks](transforms/insert-hooks/README.md)
* [modify-import](transforms/modify-import/README.md)
* [remove-features](transforms/remove-features/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`