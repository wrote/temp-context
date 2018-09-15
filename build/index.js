const { join } = require('path');
let rm = require('@wrote/rm'); if (rm && rm.__esModule) rm = rm.default;
let ensurePath = require('@wrote/ensure-path'); if (ensurePath && ensurePath.__esModule) ensurePath = ensurePath.default;
let Pedantry = require('pedantry'); if (Pedantry && Pedantry.__esModule) Pedantry = Pedantry.default;
const { lstat, createReadStream } = require('fs');
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