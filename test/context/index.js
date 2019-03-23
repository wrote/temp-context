import { resolve, join } from 'path'
import makePromise from 'makepromise'
import { lstat } from 'fs'

const FIXTURE = resolve(__dirname, '../fixture')

/**
 * A testing context for the package.
 */
export default class Context {
  async exists(p) {
    try {
      await makePromise(lstat, p)
      return true
    } catch (err) {
      return false
    }
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  /**
   * Path to the fixture directory.
   */
  get DIR() {
    return resolve(FIXTURE, 'dir')
  }
  async lstat(...args) {
    const s = await makePromise(lstat, join(...args))
    return s
  }
}