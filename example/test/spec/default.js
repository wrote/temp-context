import TempContext from '../../../src'
import { ok, equal } from 'zoroaster/assert'
import Context from '../context'
import program from '../../src'

/** @type {Object.<string, (c:Context, tc: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'writes data to a file'(
    { DATA }, { TEMP, resolve, exists, read },
  ) {
    await program(TEMP, DATA)
    const j = resolve('.test')
    console.log('Temp file location: %s', j)

    const e = await exists(j)
    ok(e)
    const res = await read('.test')
    equal(res, `hello world: ${DATA}`)
  },
}

export default T