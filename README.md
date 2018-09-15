# @wrote/temp-context

[![npm version](https://badge.fury.io/js/%40wrote%2Ftemp-context.svg)](https://npmjs.org/package/@wrote/temp-context)

`@wrote/temp-context` is a test context to create and erase temp directories.

```sh
yarn add -E @wrote/temp-context
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [**class `TempContext`**](#class-tempcontext)
  * [get `TEMP`](#get-temp)
  * [`async clone(from: string, to: boolean)`](#async-clonefrom-stringto-boolean-void)
  * [`async exists(path: string)`](#async-existspath-string-void)
  * [`async snapshot(): string`](#async-snapshot-string)
  * [static `setTemp`](#static-settemp)
- [Example](#example)
  * [Masks](#masks)
  * [Specs](#specs)
  * [Output](#output)
  * [Autocompletion](#autocompletion)
- [TODO](#todo)
- [Copyright](#copyright)
## API

The package is available by importing its default function:

```js
import tempContext from '@wrote/temp-context'
```

## **class `TempContext`**

Instances of this test context class will create a `temp` directory in the `test` folder on initialisation, and remove it at the end of each test. To change the location of the test directory, the static `setTemp` method should be called with a new location.

The test context is used with the _Zoroaster_ testing framework, which will initialise and destroy it for every test. Check the [example](#example) section to see how tests are implemented.

### get `TEMP`

Returns the path to the temp folder.

### `async clone(`<br/>&nbsp;&nbsp;`from: string,`<br/>&nbsp;&nbsp;`to: boolean,`<br/>`): void`

Clones a file or directory to the specified location.

### `async exists(`<br/>&nbsp;&nbsp;`path: string,`<br/>`): void`

Checks if the path exists.

### `async snapshot(): string`

Takes a snapshot of the temp directory, which can then be saved (and tested with _Zoroaster_ masks).

### static `setTemp`

Changes the location of the temp directory for each instance of the _TempContent_ class.## Example

_Zoroaster_ tests can be written either as masks, or more traditionally as specs. For example, a program might want to write given data to a file in a specified directory, as so:

```js
import { join } from 'path'
import { createWriteStream } from 'fs'

/**
 * Writes given data to a hidden file.
 * @param {string} path Path to the directory where to create a file.
 * @param {string} data Data to write.
 */
const program = (path, data) => {
  const j = join(path, '.test')
  const rs = createWriteStream(j)
  rs.end(`hello world: ${data}`)
}

export default program
```

When writing tests with _Zoroaster_, the project dir will have the `src` and `test` directories:

```m
example
├── src
│   └── index.js
└── test
    ├── context
    │   └── index.js
    ├── mask
    │   └── default.js
    ├── result
    │   └── index.md
    └── spec
        └── default.js
```

### Masks

To implement tests with masks, a mask implementation should be set up in the `mask` directory:

```js
import { makeTestSuite } from 'zoroaster'
import TempContext from 'TempContext'
import program from '../../src'

TempContext.setTemp('example/test/temp')

/**
 * This test suite will clone an input and take a snapshot of the temp directory.
 */
const ts = makeTestSuite('example/test/result', {
  /**
   * @param {string} input
   * @param {TempContext} context
   */
  async getResults(input, { TEMP, snapshot }) {
    await program(TEMP, input)
    const s = await snapshot()
    return s
  },
  context: TempContext,
})

export default ts
```

The results file which contains data about how input should be mapped to the output is saved in the `results` directory:

```md
// creates a file in the temp directory
input data

/* expected */
# .test

hello world: input data
/**/
```

Now when run, `zoroaster` will use the mask test suite (generated with the `makeTestSuite` function) to check that inputs match expected outputs.

### Specs

Occasionally, there are times when masks are not flexible enough to run tests (although, this should rarely happen because there is a potential to write any tests with standard `makeTestSuite` function). Specs are individual test cases, and can access test contexts assigned to the `context` property of a test suite.

```js
import { join } from 'path'
import TempContext from 'TempContext'
import { ok, equal } from 'zoroaster/assert'
import Context from '../context'
import program from '../../src'

/** @type {Object.<string, (c:Context, tc: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'writes data to a file'(
    { DATA }, { TEMP, exists, read },
  ) {
    await program(TEMP, DATA)
    const j = join(TEMP, '.test')
    const e = await exists(j)
    ok(e)
    const res = await read(j)
    equal(res, `hello world: ${DATA}`)
  },
}

export default T
```

### Output

The outcome of all the above tests can be achieved with `zoroaster -a example/test/spec example/test/mask` command, where `-a` is used to require [`alamode`](https://alamode.cc) -- a fast RegExp-based transpiler of `import` and `export` statements.

```
example/test/spec
 [32m ✓ [0m writes data to a file
 example/test/mask
   index.md
   [32m ✓ [0m creates a file in the temp directory

🦅  Executed 2 tests.
```

### Autocompletion

One of the advantages of using test context is that they are well documented and it's possible to get auto-completes for available methods when using destructuring on the context argument to a test case, both in masks as well as in specs.

![](images/autocomplete.png)

## TODO

- [ ] Add a new item to the todo list.

## Copyright

(c) [Wrote][1] 2018

[1]: https://wrote.cc