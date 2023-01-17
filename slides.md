---
# try also 'default' to start simple
theme: default
background: /cover.png
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false
# use UnoCSS
css: unocss
---

<h1 class="font-semibold">The complete guide to <span class="text-blue-300">packaging libraries</span></h1>

<p class="text-xl opacity-100!">Publish pain-free (mostly)</p>

<style>
  .slidev-layout.cover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.433), rgba(0, 0, 0, 0.633)), url("/cover.png") !important;
  }
</style>

---

# Who am I

- I'm Bjorn Lu
- Astro core resident
- Vite and Svelte core team member
- Worked in open source for 2 years

---

# Overview

1. Types of packages
2. Types of build tooling
3. Publishing `package.json` fields
4. Extra precautions
5. A special tool

---
layout: section
preload: false
---

# Let's make a library

<p v-click>With Bob</p>

<img
  class="bob fixed right-0 -bottom-8" 
  v-click
  src="/assets/bob.svg"
/>

<style>
  .bob.slidev-vclick-target {
    @apply -bottom-8;
    transition: all 500ms ease;
  }

  .bob.slidev-vclick-hidden {
    @apply -bottom-20;
  }
</style>

---

# A math library

Simple, single-entry library using ES modules (ESM).

<v-click>

```js
// main.js
export function add(a, b) {
  return a + b
}
```

```json
// package.json
{
  "name": "super-math",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./main.js"
    }
  },
  "files": ["./main.js"]
}
```

</v-click>

<br>

<v-click>

> `import` is an exports condition.

</v-click>

<!-- todo: use type module -->

<!-- Bob demands new features, questionable, mad -->

---
layout: two-cols-header
---

# Add type safety

Write in TypeScript or JSDoc.

::left::

<v-click>

#### TypeScript

```ts
const foo: string = bar

function add(a: number, b: number) {
  return a + b
}
```

</v-click>

::right::

<v-click>

#### JSDoc

```js
// JSDoc
/** @type {string} */
const foo = bar

/**
 * @param {number} a
 * @param {number} a
 */
function add(a, b) {
  return a + b
}
```

</v-click>

---
layout: center
---

<div style="width: 500px">
  <Tweet id="1566754561368494081" conversation="1"></Tweet>
</div>



---
layout: two-cols-header
---

# Add type safety (Option 1)

Write in TypeScript.

::left::

```ts
// main.ts
export function add(a: number, b: number) {
  return a + b
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./"
  }
}
```

::right::

```json {5,8,14,16-21}
// package.json
{
  "name": "super-math",
  "version": "1.0.0",
  "types": "./main.d.ts",
  "exports": {
    ".": {
      "types": "./main.d.ts",
      "import": "./main.js"
    }
  },
  "files": [
    "./main.js",
    "./main.d.ts"
  ],
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "*"
  }
}
```

---
layout: two-cols-header
---

# Add type safety (Option 2)

Write in JSDoc.

::left::

```ts
// main.d.ts
export declare function add(a: number, b: number): number
```

```ts {2}
// main.js
/** @type {import('./main.d.ts').add} */
export function add(a, b) {
  return a + b
}
```

::right::

```json {5,8,14}
// package.json
{
  "name": "super-math",
  "version": "1.0.0",
  "types": "./main.d.ts",
  "exports": {
    ".": {
      "types": "./main.d.ts",
      "import": "./main.js"
    }
  },
  "files": [
    "./main.js",
    "./main.d.ts"
  ]
}
```

---
layout: two-cols-header
---

# Multiple entries

Export from `/plugin`.

::left::

```js
// plugin.js
/** @type {import('./plugin.d.ts').plugin} */
export default function plugin() {
  return { name: 'super-math' }
}
```

```ts
// plugin.d.ts
export declare default function plugin(): Plugin
``` 

<br>
<br>

<v-click>

> `node` condition only works in Node.js.

</v-click>

::right::

```json {11-16,21-22}
// package.json
{
  "name": "super-math",
  "version": "1.0.0",
  "types": "./main.d.ts",
  "exports": {
    ".": {
      "types": "./main.d.ts",
      "import": "./main.js"
    },
    "./plugin": {
      "types": "./plugin.d.ts",
      "node": {
        "import": "./plugin.js"
      }
    }
  },
  "files": [
    "./main.js",
    "./main.d.ts",
    "./plugin.js",
    "./plugin.d.ts"
  ]
}
```

<!-- yes bob meme -->

---
layout: two-cols-header
---

# Export both CJS and ESM

Support CommonJS and ES modules.

::left::

```js
// main.cjs
/** @type {import('./main.d.ts').add} */
module.exports.add = function (a, b) {
  return a + b
}
```

```js
// plugin.cjs
/** @type {import('./plugin.d.ts').plugin} */
module.exports = function plugin() {
  return { name: 'super-math' }
}
```

::right::

```json {10,16,22,25}
// package.json
{
  "name": "super-math",
  "version": "1.0.0",
  "types": "./main.d.ts",
  "exports": {
    ".": {
      "types": "./main.d.ts",
      "import": "./main.js",
      "require": "./main.cjs"
    },
    "./plugin": {
      "types": "./plugin.d.ts",
      "node": {
        "import": "./plugin.js",
        "require": "./plugin.cjs",
      }
    }
  },
  "files": [
    "./main.js",
    "./main.cjs",
    "./main.d.ts",
    "./plugin.js",
    "./plugin.cjs",
    "./plugin.d.ts"
  ]
}
```

---
layout: section
---

# Done!

---
layout: section
---

# That's a lot of work

---

# Build tool

- Rollup
- Webpack
- Parcel
- esbuild

<!-- todo: images -->
<!-- surface you might think of these -->

---

# Build tool

- tsup
- unbuild
- tsdx
- microbundle
- svelte-package

---

# Special files

- `.vue` - Compile Vue files into JS - <small class="opacity-50">https://v2.vuejs.org/v2/cookbook/packaging-sfc-for-npm.html</small>
- `.svelte` - Preprocess and publish raw Svelte files - <small class="opacity-50">https://kit.svelte.dev/docs/packaging</small>
- `.astro` - Publish raw Astro files - <small class="opacity-50">https://docs.astro.build/en/reference/publish-to-npm</small>
- `.jsx`
  - SolidJS - Transpile and publish raw JSX files
  - React - Compile into JS
  - Preact - Compile into JS
- `.css` - Transpile if using `.scss`, `.styl`, etc and publish raw CSS files
- Other assets - Publish them raw

<br>
<br>

> Refer to your framework guides if available!

---
layout: section
---

# Exporting

---

## The `exports` field

A single key to define the entrypoints of your package.

<div grid="~ cols-3 gap-1">
<div>

```json
{
  "exports": {
    ".": {
      "import": "./main.js"
    },
    "./utils": {
      "import": "./utils.js"
    }
  }
}
```

```json
{
  "exports": {
    ".": {
      "types": "./main.d.ts",
      "import": "./main.js",
      "require": "./main.cjs"
    }
  }
}
```

</div>
<div>

```json
{
  "exports": {
    ".": {
      "import": {
        "development": "./main.dev.js",
        "production": "./main.prod.js",
        "default": "./main.js"
      }
    }
  }
}
```

```json
{
  "exports": {
    ".": {
      "node": {
        "import": "./main.node.js"
      },
      "browser": {
        "import": "./main.browser.js"
      },
      "import": "./main.js"
    }
  }
}
```

</div>
<div>

```json
{
  "exports": {
    "./*": {
      "browser": {
        "import": "./*.browser.js"
      },
      "import": "./*.js"
    },
    "./utils/*.js": {
      "import": "./utils/*/index.js"
    },
    "./assets/*": "./assets/*"
  }
}
```

</div>
</div>

---


# `main`, `module`, `types`, `browser`...

Besides `types`, these fields are superseded by `exports`.

Use them if you:

- Need to support older Node versions

<br>
<br>
<br>

```json
{
  "main": "./main.cjs",
  "module": "./main.js",
  "types": "./main.d.ts",
  "browser": "./main.browser.js",
  "jsnext:main": "./main.js",
  "jsnext": "./main.js"
}
```

---

# The `files` field

IMPORTANT. Files to keep for publishing. `.gitignore` format.

```json
{
  "files": [
    "dist",
    "./cli.js",
    "./*.d.ts",
    "!dist/internal"
  ]
}
```

---
layout: section
---

# Beware!

---

- No nodejs modules in the browser, `fs`, `crypto`, `path`, etc
- `sideEffects`
- You may not need to bundle and minify
- Dual package hazard!

---
layout: iframe-right
url: https://publint.dev
---

# publint.dev

https://github.com/bluwy/publint

- Lints packages to ensure compatibility with most environments, e.g. Vite, Webpack, Rollup, NodeJS, etc
- Works npm packages or locally
  ```bash
  npx publint ./node_modules/package
  ```

---

# Attributions

https://getavataaars.com

https://getavataaars.com/?accessoriesType=Blank&avatarStyle=Transparent&clotheColor=Heather&clotheType=CollarSweater&eyeType=Default&eyebrowType=RaisedExcitedNatural&facialHairType=BeardLight&hairColor=Brown&mouthType=Serious&skinColor=Light&topType=ShortHairShortFlat