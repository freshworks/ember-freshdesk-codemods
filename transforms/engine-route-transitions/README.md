# engine-route-transitions


## Usage

```
npx @freshworks/ember-codemods engine-route-transitions path/of/files/ or/some**/*glob.js

# or

yarn global add @freshworks/ember-codemods
@freshworks/ember-codemods engine-route-transitions path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/engine-route-transitions/__testfixtures__/basic.input.js)</small>):
```js
this.transitionTo('helpdesk.dashboards.default');
this.transitionTo('helpdesk.admin.index');

```

**Output** (<small>[basic.output.js](transforms/engine-route-transitions/__testfixtures__/basic.output.js)</small>):
```js
this.transitionTo('default');
this.transitionTo('index');

```
<!--FIXTURES_CONTENT_END-->