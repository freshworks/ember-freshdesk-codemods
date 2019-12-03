#!/usr/bin/env bash

./bin/cli.js mocha-to-qunit $1
./bin/cli.js setup-for-custom-assertions $1
jscodeshift -t https://raw.githubusercontent.com/simplabs/qunit-dom-codemod/master/qunit-dom-codemod.js $1
./bin/cli.js cleanup-imports $1
