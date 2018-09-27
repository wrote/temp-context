const { join } = require('path');
let rm = require('@wrote/rm'); if (rm && rm.__esModule) rm = rm.default;
let ensurePath = require('@wrote/ensure-path'); if (ensurePath && ensurePath.__esModule) ensurePath = ensurePath.default;
let Pedantry = require('pedantry'); if (Pedantry && Pedantry.__esModule) Pedantry = Pedantry.default;
const { lstat, createReadStream, createWriteStream } = require('fs');
const { collect } = require('catchment');
let clone = require('@wrote/clone'); if (clone && clone.__esModule) clone = clone.default;
let makePromise = require('makepromise'); if (makePromise && makePromise.__esModule) makePromise = makePromise.default;
let SnapshotStream = require('./SnapshotStream'); if (SnapshotStream && SnapshotStream.__esModule) SnapshotStream = SnapshotStream.default;

let TEMP = 'test/temp'

const getSnapshot = async (path) => {
  const pedantry = new Pedantry(path, {
    addBlankLine: true,
  })
  const s = new SnapshotStream()
  pedantry.on('file', f => s.currentFile = f)
  pedantry.pipe(s)
  const snapshot = await collect(s)
  return snapshot
}

/**
 * A test context that creates and destroys a temp directory. By default, the temp directory will be `test/temp` relative to the current working directory, but it can be changed with `setTemp` method.
 */
               class TempContext {
  async _init() {
    const p = join(TEMP, 'temp')
    await ensurePath(p)
  }
  /**
   * Read a file.
   * @param {string} path Path of the file to read.
   */
  async read(path) {
    const rs = createReadStream(path)
    const res = await collect(rs)
    return res
  }
  /**
   * Check if the path exists on the filesystem.
   * @param {string} path Path to check.
   */
  async exists(path) {
    try {
      await makePromise(lstat, path)
      return true
    } catch (err) {
      return false
    }
  }
  /**
   * Read a file relative to the temp directory.
   * @param {string} path Path of the file in the temp directory.
   */
  async readInTemp(path) {
    const p = join(this.TEMP, path)
    const rs = createReadStream(p)
    const res = await collect(rs)
    return res
  }
  /**
   * Write a file in a temp directory.
   * @param {string} data Data to write.
   * @param {string} path Path to the file within the temp directory.
   */
  async write(data, path) {
    const p = join(this.TEMP, path)
    const ws = createWriteStream(p)
    await new Promise((r, j) => {
      ws.on('error', j).on('close', r).end(data)
    })
    return p
  }
  /**
   * Path to the temp directory.
   */
  get TEMP() {
    return TEMP
  }
  async _destroy() {
    await rm(TEMP)
  }
  /**
   * Clone a file or directory.
   * @param {string} path Path to the file or directory to clone.
   * @param {string} to Path to the directory to contain the file or directory being cloned (not the path to the cloned entity).
   */
  get clone() {
    return clone
  }
  /**
   * Checks if the path exists.
   */
  async exists(path) {
    try {
      await makePromise(lstat, path)
      return true
    } catch (err) {
      return false
    }
  }
  /**
   * Capture the contents of the temp directory as a string.
   */
  async snapshot() {
    /** @type {string} */
    const s = await getSnapshot(this.TEMP)
    return s
  }
  /**
   * Sets a path for any instances of the `TempContext`.
   * @param {string} path Path to the new temp directory.
   */
  static setTemp(path) {
    TEMP = path
  }
}

module.exports = TempContext
//# sourceMappingURL=index.js.map