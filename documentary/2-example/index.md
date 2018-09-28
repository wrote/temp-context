## **Example**

_Zoroaster_ tests can be written either as masks, or more traditionally as specs. For example, a program might want to write given data to a file in a specified directory, as so:

%EXAMPLE: example/src/index.js%

When writing tests with _Zoroaster_, the project directory will have the `src` and `test` directories:

%TREE example%

### Masks

To implement tests with masks, a mask implementation should be set up in the `mask` directory:

%EXAMPLE: example/test/mask/default.js, ../../../src => temp-context%

The results file which contains data about how input should be mapped to the output is saved in the `results` directory:

%EXAMPLE: example/test/result/index.md%

Now when run, `zoroaster` will use the mask test suite (generated with the `makeTestSuite` function) to check that inputs match expected outputs.

### Specs

<!-- (although, this should rarely happen because there is a potential to write any tests with standard `makeTestSuite` function) -->

Occasionally, there are times when masks are not flexible enough to run tests. Specs are individual test cases, and can access test contexts assigned to the `context` property of a test suite.

%EXAMPLE: example/test/spec/default.js, ../../../src => temp-context%

### Output

The outcome of all the above tests can be achieved with `zoroaster -a example/test/spec example/test/mask` command, where `-a` is used to require [`alamode`](https://alamode.cc) -- a fast RegExp-based transpiler of `import` and `export` statements.

%FORK node_modules/.bin/zoroaster example/test/spec/default.js example/test/mask -a%

### Autocompletion

One of the advantages of using test context is that they are well documented and it's possible to get auto-completes for available methods when using destructuring on the context argument to a test case, both in masks as well as in specs.

![](images/autocomplete.png)

%~%