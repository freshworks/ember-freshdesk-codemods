#!/usr/bin/env bash

echo 'Running base tranforms'
./bin/cli.js mocha-to-qunit $1

echo 'Running qunit-dom tranforms'
jscodeshift -t https://raw.githubusercontent.com/simplabs/qunit-dom-codemod/master/qunit-dom-codemod.js $1

echo 'Cleaning up additional qunit-dom tranforms'
./bin/cli.js cleanup-imports $1

echo 'Running async leaks'
./bin/cli.js async-leaks $1
