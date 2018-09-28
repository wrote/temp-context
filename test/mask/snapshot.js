import { makeTestSuite } from 'zoroaster'
import TempContext from '../../src'

/**
 * This test suite will clone an input and take a snapshot of the temp directory.
 */
const ts = makeTestSuite('test/result/snapshot.md', {
  /**
   * @param {string} input
   * @param {TempContext} param1
   */
  async getResults(input, { TEMP, clone, snapshot }) {
    await clone('test/fixture/dir', TEMP)
    const s = await snapshot(input)
    return s
  },
  context: TempContext,
})

export default ts