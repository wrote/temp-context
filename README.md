# @wrote/temp-context

[![npm version](https://badge.fury.io/js/@wrote/temp-context.svg)](https://npmjs.org/package/@wrote/temp-context)

`@wrote/temp-context` is A test context to create and erase temp directories.

```sh
yarn add -E @wrote/temp-context
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`tempContext(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
- [TODO](#todo)
- [Copyright](#copyright)

## API

The package is available by importing its default function:

```js
import tempContext from '@wrote/temp-context'
```

### `tempContext(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

```js
/* yarn example/ */
import tempContext from '@wrote/temp-context'

(async () => {
  await tempContext()
})()
```

## TODO

- [ ] Add a new item to the todo list.

## Copyright

(c) [Wrote][1] 2018

[1]: https://wrote.cc
