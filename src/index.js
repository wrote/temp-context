import { join } from 'path'
import rm from '@wrote/rm'
import ensurePath from '@wrote/ensure-path'

let TEMP = 'test/temp'

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
   * Sets a path for any instances of the `TempContext`.
   * @param {string} path Path to the new temp directory.
   */
  static setTemp(path) {
    TEMP = path
  }
}