const { join } = require('path');
let rm = require('@wrote/rm'); if (rm && rm.__esModule) rm = rm.default;
let ensurePath = require('@wrote/ensure-path'); if (ensurePath && ensurePath.__esModule) ensurePath = ensurePath.default;
let Pedantry = require('pedantry'); if (Pedantry && Pedantry.__esModule) Pedantry = Pedantry.default;
const { lstat, createWriteStream } = require('fs');
const { collect } = require('catchment');
let clone = require('@wrote/clone'); if (clone && clone.__esModule) clone = clone.default;
let read = require('@wrote/read'); if (read && read.__esModule) read = read.default;
let makePromise = require('makepromise'); if (makePromise && makePromise.__esModule) makePromise = makePromise.default;
const { tmpdir } = require('os');
let SnapshotStream = require('./SnapshotStream'); if (SnapshotStream && SnapshotStream.__esModule) SnapshotStream = SnapshotStream.default;

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
 * A test context that creates and destroys a temp directory. By default, the temp directory will be `test/temp` relative to the current working directory, but it can be changed by extending the class and setting its `TEMP` property in the constructor.
 */
               class TempContext {
  constructor() {
    this._TEMP = 'test/temp'
  }
  async _init() {
    const p = this.resolve('t')
    await ensurePath(p)
  }
  /**
   * This method should be called in the constructor by classes that extend the `TempContext` to use the temp directory of the os system.
   * @param {string} name The name of the directory inside of the temp dir.
   */
  _useOSTemp(name) {
    this._TEMP = join(tmpdir(), name)
  }
  /**
   * Read a file.
   * @param {string} path Path of the file to read.
   */
  get readGlobal() {
    return read
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
  async read(path) {
    const p = this.resolve(path)
    const res = await read(p)
    return res
  }
  /**
   * Write a file in a temp directory.
   * @param {string} data Data to write.
   * @param {string} path Path to the file within the temp directory.
   */
  async write(data, path) {
    const p = this.resolve(path)
    const ws = createWriteStream(p)
    await new Promise((r, j) => {
      ws.on('error', j).on('close', r).end(data)
    })
    return p
  }
  /**
   * Get a path to a file inside of the temp directory.
   * @param {string} path The path to the file inside of the temp dir.
   */
  resolve(path) {
    return join(this.TEMP, path)
  }
  /**
   * Path to the temp directory.
   */
  get TEMP() {
    return this._TEMP
  }
  set TEMP(val) {
    this._TEMP = val
  }
  async _destroy() {
    await rm(this.TEMP)
  }
  /**
   * Remove a file inside of the temp directory.
   * @param {string} path The path of the file to remove.
   */
  async rm(path) {
    const p = this.resolve(path)
    await rm(p)
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
   * Capture the contents of the temp directory as a string (or partial contents if the inner path is given).
   * @param {string} innerPath Path inside of the temp dir to snapshot.
   * @todo add the ignore option
   */
  async snapshot(innerPath = '.') {
    const p = this.resolve(innerPath)
    /** @type {string} */
    const s = await getSnapshot(p)
    return s
  }
}

module.exports = TempContext
//# sourceMappingURL=index.js.map