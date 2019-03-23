import makeTestSuite from '@zoroaster/mask'
import TempContext from '../../src'

/**
 * This test suite will check if a source exists.
 */
const ts = makeTestSuite('test/result/exists.md', {
  /**
   * @param {string} input
   * @param {TempContext} param1
   */
  async getResults(input, { TEMP, exists, clone }) {
    await clone('test/fixture/dir', TEMP)
    const s = await exists(input)
    return s
  },
  jsonProps: ['expected'],
  context: TempContext,
})

const g = makeTestSuite('test/result/exists-global.md', {
  /**
   * @param {string} input
   * @param {TempContext} param1
   */
  async getResults(input, { existsGlobal }) {
    const s = await existsGlobal(input)
    return s
  },
  jsonProps: ['expected'],
  context: TempContext,
})

export { g as global }

export default ts