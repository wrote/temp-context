## API

The package is available by importing its default function:

```js
import TempContext from 'temp-context'
```

%~%

## **class `TempContext`**

Instances of this test context class will create a `temp` directory in the `test` folder on initialisation, and remove it at the end of each test. To change the location of the test directory, [extend the class](#extending).

The test context is used with the _Zoroaster_ testing framework, which will initialise and destroy it for every test. Check the [example](#example) section to see how tests are implemented.

### get `TEMP`

Return the path to the temp folder.

```### resolve => string
[
  ["path", "string"]
]
```

Resolve a path inside of the temp directory, e.g., `resolve('data.temp')` will return `test/temp/data.temp`.

```### async exists => boolean
[
  ["path", "string"]
]
```

Check if the path exists in the temp directory.

```### async existsGlobal => boolean
[
  ["path", "string"]
]
```

Check if the path exists on the filesystem.

```### async read => string
[
  ["path", "string"]
]
```

Read the file in the temp directory and returns its contents.

```### async readGlobal => string
[
  ["path", "string"]
]
```

Read the file given its path and returns its contents. Alias for [`@wrote/read`](https://github.com/wrote/read).

```### async write => string
[
  ["data", "string"],
  ["path", "string"]
]
```

Write to the file in the temp directory and return its path.

```### async add => string
[
  ["target", "string"]
]
```

Adds a file or directory to the temp directory and returns its new path.

```### async clone
[
  ["from", "string"],
  ["to", "boolean"]
]
```

Clone a file or directory to the specified location. Alias for [`@wrote/clone`](https://github.com/wrote/clone).

```### async rm
[
  ["path", "string"]
]
```

Remove a file or folder inside of the temp directory. Alias for [`@wrote/rm`](https://github.com/wrote/rm).

```### async snapshot => string
[
  ["innerPath?", "string"]
]
```

Takes a snapshot of the temp directory, which can then be saved and tested either with _Zoroaster_ masks or [`snapshot-context`](https://github.com/artdecocode/snapshot-context).

%~%