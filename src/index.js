import { join } from 'path'
import rm from '@wrote/rm'
import ensurePath from '@wrote/ensure-path'
import Pedantry from 'pedantry'
import { lstat, createReadStream, createWriteStream } from 'fs'
import { collect } from 'catchment'
import clone from '@wrote/clone'
import makePromise from 'makepromise'
import SnapshotStream from './SnapshotStream'

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
export default class TempContext {
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