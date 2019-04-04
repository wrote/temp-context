import makeTestSuite from '@zoroaster/mask'
import TempContext from '../../src'

/**
 * This test suite will clone an input and take a snapshot of the temp directory.
 */
export default makeTestSuite('test/result/snapshot', {
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