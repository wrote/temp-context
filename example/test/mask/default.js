import makeTestSuite from '@zoroaster/mask'
import TempContext from '../../../src'
import program from '../../src'

/**
 * This test suite will clone an input and take a snapshot of the temp directory.
 */
export default makeTestSuite('example/test/result', {
  /**
   * @param {string} input
   * @param {TempContext} context
   */
  async getResults(input, { TEMP, snapshot }) {
    await program(TEMP, input)
    const s = await snapshot()
    return s
  },
  context: TempContext,
})