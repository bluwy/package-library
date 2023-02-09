---
theme: default
background: /cover.png
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  The complete guide to packaging libraries
drawings:
  persist: false
css: unocss
transition: fade
---

<h1 class="font-semibold">The complete guide to <span class="text-blue-300">packaging libraries</span></h1>

<p class="text-xl opacity-100!">Publish pain-free (mostly)</p>

<p class="fixed left-8 bottom-2">Vue.js Amsterdam 2023</p>

<style>
  .slidev-layout.cover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.433), rgba(0, 0, 0, 0.633)), url("/cover.png") !important;
  }
</style>

<!--
Ask if anyone publish before
-->

---
layout: image-right
image: /tree-path.jpg
---

# Overview

<v-clicks>

1. Simple packages
2. Using build tools
3. Reducing complexity
4. Important bits
5. A special tool

</v-clicks>

<!-- There will be a lot of info dump, you can access the slides online later. Focuses on packaging libraries, assumes you have some knowledge about writing JS code. -->

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

<!--
Astro: Talks from Fred and Elian yesterday

Vite: There should be a meeting now

Svelte: Vue is great too if you find it productive
-->

---
layout: section
preload: false
---

# Let's make a library

<p v-click>With Bob</p>

<div v-click>

<Bob right normal />

</div>

<!-- what do you want to do today -->

<div v-click>

<Bob right talk msg="Let's make a math library!" />

</div>

<!-- are you sure? -->

<div v-click>

<Bob right mad msg="YES" />

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

<!--
It can be boring, so we'll have Bob. Also joking about why make a math library.
-->

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
    ".": "./main.js"
  },
  "files": ["./main.js"]
}
```

</v-click>

<div v-click>

<Bob left />

</div>

<div v-click>

<Bob left talk msg="Let's add types!" />

</div>

---
layout: two-cols-header
---

# Add type safety

Write in TypeScript.

::left::

<v-click>

```ts
// main.ts
export function add(a: number, b: number) {
  return a + b
}
```

</v-click>

<v-click>

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

</v-click>

::right::

<v-click>

```json {5,8|15-20|9,12-14}
// package.json
{
  "name": "super-math",
  "version": "1.0.0",
  "types": "./dist/main.d.ts",
  "exports": {
    ".": {
      "types": "./dist/main.d.ts",
      "default": "./dist/main.js"
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

</v-click>

<div v-click>

<Bob left />

</div>

<div v-click>

<Bob left talk msg="What about CommonJS?" />

</div>

<!-- what about it? (joking) -->

<div v-click>

<Bob left sad />

</div>

<!--
Type safety for us and users
-->

---
layout: two-cols-header
---

# ESM vs CJS

::left::

ECMAScript modules

```js
import { foo } from 'bar'

const hello = 'world'

const data = await import('./data.js')






export { hello }
```

::right::

CommonJS

```js
const bar = require('bar')

const hello = 'world'

async function run() {
  const data = await import('./data.js')
  return data
}

const syncData = require('./data.js')

module.exports = { hello }
```

---
layout: two-cols-header
---

# Export both ESM and CJS

Support ES modules and CommonJS so it works in older Node.js versions.

::left::

<v-click>

```json {9,10,17}
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

</v-click>

::right::

<v-click>

```bash
tsc --module commonjs --declaration false &&
  node scripts/rename.js &&
  tsc
```

</v-click>

<br>

<v-click>

1. Generate `./dist/main.js` in CJS.
2. Rename `./dist/main.js` to `./dist/main.cjs`.
3. Generate  `./dist/main.js` in ESM and `./dist/main.d.ts`.

</v-click>

<div v-click>

<Bob right />

</div>

<div v-click>

<Bob right talk msg="How about some advanced maths" />

</div>

---
layout: two-cols-header
---

# Multiple entries

Advanced maths through `super-math/advanced`.

::left::

<v-click at="1">

```ts
// plugin.ts
import { createHash } from 'node:crypto'
export function getHash(text: string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 8)
}
```

</v-click>

<br>

<v-click at="3">

> `node` condition only works in Node.js. You can use the inverse `browser` condition if it's meant for browser usage only.

</v-click>

::right::

<v-click at="2">

```json {6-12,16,19}
// package.json
{
  ...
  "exports": {
    ...
    "./advanced": {
      "types": "./dist/advanced.d.ts",
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
    "build": "tsc --module commonjs --declaration false && node scripts/rename.js && tsc"
  },
  "devDependencies": {
    "typescript": "*"
  }
}
```

</v-click>

---
layout: section
prerender: false
---

# Done!

<ConfettiExplosion />

<v-clicks>

1. exports field
2. Using TypeScript
3. Support ESM and CJS
4. Multiple entries

</v-clicks>

---
layout: section
---

# That's a lot of work

<v-click>

And that's where build tools come in.

</v-click>

<!-- it simplifies the build script, allows to alter the build output easily

use case:

1. bundle files into one so we don't have multiple d.ts files
2. easier to consume from a CDN
3. special files

 -->

---
layout: two-cols-header
---

::left::

# Build tools

- [Rollup](https://rollupjs.org)
- [Webpack](https://webpack.js.org)
- [Parcel](https://parceljs.org)
- [esbuild](https://esbuild.github.io)
- [Turbopack](https://turbo.build/pack)
- [SWC](https://swc.rs)

<img class="inline-block h-24 mr-8 mt-4 ml-4 mb-8" src="/rollup.svg" />
<img class="inline-block h-24 mr-5 mt-4 mb-8" src="/webpack.svg" />
<img class="inline-block h-24 mr-5 mt-4 mb-8" src="/parcel.png" />

<br>

<img class="inline-block h-24 mr-5 mt-4" src="/esbuild.svg" />
<img class="inline-block h-24 mr-8 mt-4" src="/turbopack.svg" />
<img class="inline-block h-14 mr-5 mt-4" src="/swc.png" />

::right::

<v-click>

# More build tools

- [tsup](https://tsup.egoist.dev)
- [unbuild](https://github.com/unjs/unbuild)
- [tsdx](https://tsdx.io)
- [microbundle](https://github.com/developit/microbundle)
- [svelte-package](https://kit.svelte.dev/docs/packaging)

</v-click>

<!--
General purpose and Specific. Can't go wrong with specific.
-->

---

# Specialized build tool (tsup)

```json {4,8}
{
  ...
  "scripts": {
    "build": "tsup ./main.ts ./advanced.ts --dts --format cjs,esm"
  },
  "devDependencies": {
    "@types/node": "*",
    "tsup": "*",
    "typescript": "*"
  }
}
```

<br />

<v-click>

- Simplified command
- Types are bundled
- Best practices out-of-the-box

</v-click>

---

# Handle special files

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

<!--
For Vue, you can use Rollup and vite-plugin-vue for example.

There is so many things to consider. But there is calm within the storm.
-->

---
layout: cover
background: /frustration.jpg
class: 'text-center'
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
// main.js
/** @type {string} */
const foo = bar

/** @type {import('./main').add} */
function add(a, b) {
  return a + b
}
```

::right::

<v-click>

- Hand roll `.d.ts` files
- Use JSDoc comments
- No bundling / transpiling
- Easier to debug
- Full type safety preserved

</v-click>

<!-- Fred's talk yesterday mentioned "Type safety is eating the world" -->

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
      "default": "./main.js"
    },
    "./advanced": {
      "types": "./advanced.d.ts",
      "node": "./advanced.js"
    }
  }
}
```

---

# Export raw for private packages

For private npm packages, or workspace packages, it is sometimes fine to export files as-is since you're the only consumer.

```json
{
  "name": "super-math",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./main.ts",
    "./advanced": "./advanced.ts"
  }
}
```

<!-- 
Check out Lucie's talk on this topic later today for a deeper dive.
-->

---
layout: cover
background: /glasses.jpg
class: 'text-center'
---

# Important bits

<style>
  .slidev-layout.cover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.433), rgba(0, 0, 0, 0.633)), url("/glasses.jpg") !important;
  }
</style>

---
layout: section
---

# package.json

---

## `exports`

A single key to define the package entrypoints. https://nodejs.org/api/packages.html#subpath-exports

<div grid="~ cols-3 gap-1">
<div>

```json
{
  "exports": {
    ".": "./main.js",
    "./utils": "./utils.js"
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
      "node": "./main.node.js",
      "browser": "./main.browser.js",
      "default": "./main.js"
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
      "browser": "./*.browser.js",
      "default": "./*.js"
    },
    "./utils/*.js": "./utils/*/index.js",
    "./assets/*": "./assets/*"
  }
}
```

</div>
</div>

---


# `main`, `module`, `types`, `browser`...

Besides `types`, these fields are superseded by `exports`.

- `main`: https://nodejs.org/api/packages.html#main
- `types`: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package
- `browser`: https://github.com/defunctzombie/package-browser-field-spec

<br>

```json
{
  "main": "./main.cjs",
  "module": "./main.js",
  "types": "./main.d.ts",
  "browser": "./main.browser.js"
}
```

---
layout: two-cols-header
---

# `files`

**IMPORTANT!**

Files to be packed as tarball for publishing. Same as `.gitignore` format. You can run `npm pack` to confirm!

https://docs.npmjs.com/cli/v9/configuring-npm/package-json#files

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

# `sideEffects`

Tell bundlers if the package has side effects or not.

Side effects are code that changes the global runtime on import, without explicitly calling an API.

https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free

::left::

```js
// main.js
document.title = "Imported!"

export function foo() {
  return document.title
}
```

::right::

```json
// package.json
{
  "sideEffects": true
}
```

---
layout: section
---

# Many little rules


---

# Many little rules

- No Node.js modules in browser code
- No browser-only API in Node.js code
- Don't mix `require()` in ESM
- Make sure JS file extensions are correct for ESM and CJS
  - A file is ESM if it's `.mjs` or has `"type": "module"` in nearest `package.json`
  - A file is CJS if it's `.cjs` or has no `"type": "module"` in nearest `package.json`
- Set `engines.node` field if depend on a specific Node.js version
- The `typesVersion` field may be needed for multiple export typings
  - https://github.com/andrewbranch/example-subpath-exports-ts-compat
- Types may not work in ESM and CJS with `node16` `moduleResolution`
  - https://arethetypeswrong.github.io

<style>
li {
  margin-top: .4rem;
  margin-bottom: .4rem;
}
</style>

---
layout: cover
background: /explain.jpg
class: text-center
---

# There's a lot to remember

---
layout: iframe-right
url: https://publint.dev
---

# publint.dev

https://github.com/bluwy/publint

- Lints packages to ensure compatibility with most environments, e.g. Vite, Webpack, Rollup, NodeJS, etc
- Catches most pitfalls showed earlier
- Works with npm packages or locally
  ```bash
  # Lint current directory
  npx publint
  ```

<img src="/publint-qr.png" class="m-4 h-50 rounded">

---

# Attributions

These resources and tools help this presentation!

https://getavataaars.com ([Bob](https://getavataaars.com/?accessoriesType=Blank&avatarStyle=Transparent&clotheColor=Heather&clotheType=CollarSweater&eyeType=Default&eyebrowType=RaisedExcitedNatural&facialHairType=BeardLight&hairColor=Brown&mouthType=Serious&skinColor=Light&topType=ShortHairShortFlat))

https://antfu.me/posts/publish-esm-and-cjs

https://github.com/sheremet-va/dual-packaging

https://sli.dev

https://unsplash.com ([1](https://source.unsplash.com/HKQVX9_JupM), [2](https://source.unsplash.com/hko-iWhYdYE), [3](https://source.unsplash.com/3mt71MKGjQ0))

---
layout: section
---

# Thank you

<div class="w-50 mx-auto text-left">

![github](/github.svg) [@bluwy](https://github.com/bluwy)

![mastodon](/mastodon.svg) [@bluwy@webtoo.ls](https://m.webtoo.ls/@bluwy)

![twitter](/twitter.svg) [@bluwyoo](https://twitter.com/bluwyoo)

</div>

<br />

Slides: https://package-library.bjornlu.com

Repo: https://github.com/bluwy/package-library

<Bob talk />

<img v-click src="/slide-qr.png" class="fixed bottom-14 right-8 h-50 rounded">

<style>
img[alt] {
  display: inline-block;
  height: 26px;
  filter: brightness(0) invert(1);
  margin-right: 0.6rem;
}
</style>

<!--
Find me at these places

Happy to chat if you have questions
-->
