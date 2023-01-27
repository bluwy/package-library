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
layout: image-right
image: https://source.unsplash.com/HKQVX9_JupM
---

# Overview

<v-clicks>

1. Simple packages
2. Using build tools
3. Reducing complexity
4. Where to learn more
5. A special tool

</v-clicks>

---
clicks: 5
---

# Who am I

<v-clicks>

- I'm Bjorn Lu
- From Malaysia
- Astro core resident
- Vite and Svelte core team member
- Worked in open source for 2 years

</v-clicks>

<v-clicks at="2">
  <img class="absolute -bottom-50 -right-80 opacity-50" src="/my_location.png" style="clip-path: circle(45%);" />
</v-clicks>

<v-clicks at="2">
  <p class="absolute bottom-62 right-38 text-3xl text-red-700 font-semibold">Kuching</p>
</v-clicks>

<v-clicks at="3">
  <img class="absolute bottom-80 right-100 h-30" src="/astro.svg" />
</v-clicks>

<v-clicks at="4">
  <img class="absolute bottom-40 right-120 h-26" src="/vite.svg" />
</v-clicks>

<v-clicks at="4">
  <img class="absolute bottom-40 right-80 h-28" src="/svelte.svg" />
</v-clicks>

---
layout: section
preload: false
---

# Let's make a library

<p v-click>With Bob</p>

<img
  class="bob fixed right-0 -bottom-8" 
  v-click
  src="/bob.svg"
/>

<!-- what do you want to do today -->

<img
  class="fixed right-0 -bottom-8" 
  v-click
  src="/bob-talk.svg"
/>

<div v-after>

<TalkBubble>
  Let's make a math library!
</TalkBubble>

</div>

<!-- are you sure? -->

<img
  class="fixed right-0 -bottom-8" 
  v-click
  src="/bob-mad.svg"
/>

<div v-after>

<TalkBubble>
  YES
</TalkBubble>

</div>

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
layout: two-cols-header
---

# A math library

Simple, single-entry library using ES modules (ESM).

::left::

<v-click>

```js
// main.js
export function add(a, b) {
  return a + b
}
```
</v-click>

::right::

<v-click>

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

<br>

> `import` is an exports condition.

</v-click>

<!-- Bob demands new features, questionable, mad -->

---
layout: two-cols-header
---

# Add type safety

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
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

::right::

```json {5,8,13-14,15-20}
// package.json
{
  "name": "super-math",
  "version": "1.0.0",
  "types": "./dist/main.d.ts",
  "exports": {
    ".": {
      "types": "./dist/main.d.ts",
      "import": "./dist/main.js"
    }
  },
  "files": [
    "dist"
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

# Export both ESM and CJS

Support ES modules and CommonJS so it works in older Node.js versions.

<!-- TODO: Show interim example of ESM vs CJS -->

::left::

```json {10,17}
// package.json
{
  "name": "super-math",
  "version": "1.0.0",
  "types": "./dist/main.d.ts",
  "exports": {
    ".": {
      "types": "./dist/main.d.ts",
      "import": "./dist/main.js",
      "require": "./dist/main.cjs"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc --module commonjs --declaration false && node scripts/rename.js && tsc"
  },
  "devDependencies": {
    "typescript": "*"
  }
}
```

::right::

```bash
tsc --module commonjs --declaration false &&
  node scripts/rename.js &&
  tsc
```

<br>

1. Generate `./dist/main.js` in CJS.
2. Rename `./dist/main.js` to `./dist/main.cjs`.
3. Generate  `./dist/main.js` in ESM and `./dist/main.d.ts`.



---
layout: two-cols-header
---

# Multiple entries

Advanced maths through `super-math/advanced`.

::left::

```ts
// plugin.ts
import { createHash } from 'node:crypto'
export function getHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 8)
}
```

<br>

<v-click>

```bash {all|3}
tsc --module commonjs --declaration false &&
  node scripts/rename.js &&
  tsc --declarationDir ./
```

... Same as before, but generate types to `./` instead.

So that TypeScript finds `./advanced.d.ts` when importing `super-math/advanced`.

</v-click>

<v-click>

> `node` condition only works in Node.js.

</v-click>

::right::

```json {6-12,16,19}
// package.json
{
  ...
  "exports": {
    ...
    "./advanced": {
      "types": "./advanced.d.ts",
      "node": {
        "import": "./dist/advanced.js",
        "require": "./dist/advanced.cjs"
      }
    }
  },
  "files": [
    "dist",
    "*.d.ts"
  ],
  "scripts": {
    "build": "tsc --module commonjs --declaration false && node scripts/rename.js && tsc --declarationDir ./"
  },
  "devDependencies": {
    "typescript": "*"
  }
}
```

<!-- yes bob meme -->

---
layout: section
---

# Done!

---
layout: section
---

# That's a lot of work

<v-click>

And that's where build tools come in.

</v-click>

---
layout: two-cols-header
---

::left::

# Build tools

- [Rollup](https://rollupjs.org)
- [Webpack](https://webpack.js.org)
- [Parcel](https://parceljs.org)
- [esbuild](https://esbuild.github.io)

<img class="inline-block h-24 mr-16 mt-4 ml-6 mb-8" src="/rollup.svg" />
<img class="inline-block h-24 mr-5 mt-4 mb-8" src="/webpack.svg" />

<br>

<img class="inline-block h-24 mr-8 mt-4" src="/parcel.png" />
<img class="inline-block h-24 mr-5 mt-4" src="/esbuild.svg" />

<!-- surface you might think of these -->

::right::

<v-click>

# More build tools

- [tsup](https://tsup.egoist.dev)
- [unbuild](https://github.com/unjs/unbuild)
- [tsdx](https://tsdx.io)
- [microbundle](https://github.com/developit/microbundle)
- [svelte-package](https://kit.svelte.dev/docs/packaging)

</v-click>

---
layout: two-cols-header
---

# Using tsup

::left::

```json {21,25|4,7,12}
{
  ...
  "type": "module",
  "types": "./dist/main.d.ts",
  "exports": {
    ".": {
      "types": "./dist/main.d.ts",
      "import": "./dist/main.js",
      "require": "./dist/main.cjs"
    },
    "./advanced": {
      "types": "./dist/advanced.d.ts",
      "node": {
        "import": "./dist/advanced.js",
        "require": "./dist/advanced.cjs"
      }
    }
  },
  ...
  "scripts": {
    "build": "tsup ./main.ts ./advanced.ts --dts --format cjs,esm"
  },
  "devDependencies": {
    "@types/node": "*",
    "tsup": "^6.5.0",
    "typescript": "*"
  }
}
```

::right::

- Simplified command
- Types issue returns

<style>
.shiki-container {
  height: 28rem;
}
</style>

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

<!-- There is so many things to consider. But there is calm within the storm -->

---
layout: section
---

# It's complex!

But we can simplify it.

---
layout: two-cols-header
---

# Simplify type safety

Remove TypeScript, use JSDoc.

::left::

```ts
// main.d.ts
export declare function add(a: number, b: number): number;
```

```js
/** @type {string} */
const foo = bar

/** @type {import('./main').add} */
function add(a, b) {
  return a + b
}
```

::right::

<v-clicks>

- Hand roll `.d.ts` files
- Use JSDoc comments
- No bundling / transpiling
- Easier to debug
- Full type safety preserved

</v-clicks>

---
layout: center
---

<div style="width: 500px">
  <Tweet id="1566754561368494081" conversation="1"></Tweet>
</div>

---
layout: two-cols-header
---

# Simplify ESM and CJS

If backwards compatibility is not required, you can drop CJS.

::left::

```json {6-18}
{
  "name": "super-math",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "types": "./main.d.ts",
  "exports": {
    ".": {
      "types": "./main.d.ts",
      "import": "./main.js"
    },
    "./advanced": {
      "types": "./advanced.d.ts",
      "node": {
        "import": "./advanced.js"
      }
    }
  }
}
```

---
layout: section
---

# Research!

---

## The `exports` field

A single key to define the package entrypoints. https://nodejs.org/api/packages.html#subpath-exports

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

- https://nodejs.org/api/packages.html#main
- https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package
- https://github.com/defunctzombie/package-browser-field-spec

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
layout: two-cols-header
---

# The `files` field

IMPORTANT. Files to be packed as tarball for publishing. Same as `.gitignore` format.

::left::

```json
{
  "files": [
    "dist",
    "./cli.js",
    "*.d.ts",
    "!dist/internal"
  ]
}
```

---
layout: two-cols-header
---

# The `sideEffects` field

Tell bundlers if the package has side effects or not.

Side effects are code that changes the global runtime on import, without explicitly calling an API.

::left::

```js
document.title = "Imported!"

export function foo() {
  return document.title
}
```

---
layout: section
---

# There's a lot to remember

---
layout: iframe-right
url: https://publint.dev
---

# publint.dev

https://github.com/bluwy/publint

- Lints packages to ensure compatibility with most environments, e.g. Vite, Webpack, Rollup, NodeJS, etc
- Works with npm packages or locally
  ```bash
  # Lint current directory
  npx publint

  # Lint node_modules / dependencies
  npx publint deps
  ```

---

# Attributions

https://getavataaars.com

https://getavataaars.com/?accessoriesType=Blank&avatarStyle=Transparent&clotheColor=Heather&clotheType=CollarSweater&eyeType=Default&eyebrowType=RaisedExcitedNatural&facialHairType=BeardLight&hairColor=Brown&mouthType=Serious&skinColor=Light&topType=ShortHairShortFlat

https://antfu.me/posts/publish-esm-and-cjs

https://github.com/sheremet-va/dual-packaging
