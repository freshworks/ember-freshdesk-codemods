# add-layout


## Usage

```
npx @freshworks/ember-codemods add-layout path/of/files/ or/some**/*glob.js

# or

yarn global add @freshworks/ember-codemods
@freshworks/ember-codemods add-layout path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/add-layout/__testfixtures__/basic.input.js)</small>):
```js
import Component from "@ember/component";

export default Component.extend({
  classNames: ["page-content"],
});

```

**Output** (<small>[basic.output.js](transforms/add-layout/__testfixtures__/basic.output.js)</small>):
```js
import layout from "../../templates/components/page-layout/admin-content";
import Component from "@ember/component";

export default Component.extend({
  classNames: ["page-content"],
});

```
<!--FIXTURES_CONTENT_END-->