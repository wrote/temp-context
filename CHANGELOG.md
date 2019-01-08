## 8 Jan 2019

### 2.1.0

- [feature] Implement `add` method to place a file or directory in the temp folder.
- [fix] Resolve the real path to the OS temp in `_useOSTemp` (as on MacOs, `os.tmpdir()` returns a symlink).

## 28 September 2018

### 2.0.0

- [feature] (breaking) Remove `static setDir(path)` in favour of extending the class, document extending.
- [feature] (breaking) Prefer relative file methods (e.g., `read` means read in temp directory and `readGlobal` means read on the filesystem) and add some new methods.
- [feature] Snapshot a file.

### 1.3.0

- [feature] Partial snapshot.

## 27 September 2018

### 1.2.0

- [fix] Add `exists` method documentation.
- [fix] Remove and clone symlinks.

## 20 September 2018

### 1.1.0

- [feature] Add the `write` and `readInTemp` methods.

## 15 September 2018

### 1.0.0

- Create `@wrote/temp-context` with [`mnp`][https://mnpjs.org]
- [repository]: `src`, `test`