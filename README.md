# ember-freshdesk-codemods


A collection of codemods by Freshworks.

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
* [mocha-to-qunit](transforms/mocha-to-qunit/README.md)
* [modify-import](transforms/modify-import/README.md)
* [setup-helpers-with-await](transforms/setup-helpers-with-await/README.md)
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