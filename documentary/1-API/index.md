
## API

The package is available by importing its default function:

```js
import tempContext from '@wrote/temp-context'
```

## class `TempContext`

Instances of this test context class will create a `temp` directory in the `test` folder on initialisation, and remove it at the end of each test. To change the location of the test directory, the static `setTemp` method should be called with a new location.

The test context is used within the _Zoroaster_ testing framework, which will initialise and destroy it for every test.



### get `TEMP`

Returns the path to the temp folder.

```### async clone
[
  ["from", "string"],
  ["to", "boolean"]
]
```

Clones a file or directory to the specified location.

```### async exists
[
  ["path", "string"]
]
```

Checks if the path exists.

```### async snapshot => string
```

Takes a snapshot of the temp directory, which can then be saved (and tested with _Zoroaster_ masks).

### static `setTemp`

Changes the location of the temp directory for each instance of the _TempContent_ class.