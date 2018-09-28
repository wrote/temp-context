import { makeTestSuite } from 'zoroaster'
import TempContext from '../../src'

/**
 * This test suite will check if a source exists.
 */
const ts = makeTestSuite('test/result/exists.md', {
  /**
   * @param {string} input
   * @param {TempContext} param1
   */
  async getResults(input, { exists }) {
    const s = await exists(input)
    return s
  },
  jsonProps: ['expected'],
  context: TempContext,
})

export default ts