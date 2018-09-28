import ensurePath from '@wrote/ensure-path'
import rm from '@wrote/rm'
import clone from '@wrote/clone'
import read from '@wrote/read'
import write from '@wrote/write'
import { join } from 'path'
import { lstat } from 'fs'
import makePromise from 'makepromise'
import { tmpdir } from 'os'
import { getSnapshot } from './lib'

/**
 * A test context that creates and destroys a temp directory. By default, the temp directory will be `test/temp` relative to the current working directory, but it can be changed by extending the class and setting its `TEMP` property in the constructor.
 */
export default class TempContext {
  constructor() {
    this._TEMP = join('test', 'temp')
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
   * Read a file from the filesystem.
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
   * Read a file inside of the temp directory.
   * @param {string} path Path of the file in the temp directory.
   */
  async read(path) {
    const p = this.resolve(path)
    const res = await read(p)
    return res
  }
  /**
   * Write a file in the temp directory.
   * @param {string|Buffer} path Path to the file within the temp directory.
   * @param {string} data Data to write.
   */
  async write(path, data) {
    const p = this.resolve(path)
    await write(p, data)
    return p
  }
  /**
   * Get a path to a file inside of the temp directory.
   * @param {string} path The relative path to the file inside of the temp dir.
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
    const s = await getSnapshot(p, innerPath)
    return s
  }
}