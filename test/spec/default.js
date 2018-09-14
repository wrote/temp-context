import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import tempContext from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof tempContext, 'function')
  },
  async 'calls package without error'() {
    await tempContext()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await tempContext({
      type: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T