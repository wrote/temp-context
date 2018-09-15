import { join } from 'path'
import rm from '@wrote/rm'
import ensurePath from '@wrote/ensure-path'
import Pedantry from 'pedantry'
import { lstat } from 'fs'
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
  async exists(p) {
    try {
      await makePromise(lstat, p)
      return true
    } catch (err) {
      return false
    }
  }
  /**
   * Capture the contents of the temp directory as a string.
   */
  async snapshot() {
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